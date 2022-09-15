import * as jwtLib from "jsonwebtoken";
import { AuthRepository, AuthVerifyListRepository } from "../repositories/_.exporter";
import {
    AwsSesProvider,
    BcryptProvider,
    DateProvider,
    DayjsProvider,
    JwtProvider,
    MysqlProvider,
    RandomGenerator,
} from "../../modules/_.loader";
import {
    ConflictException,
    ForBiddenException,
    NotFoundException,
    UserDto,
    SigninUserDto,
    SignupUserDto,
    LogoutUserDto,
    PublishTokenDto,
    SendEmailDto,
    ConfirmEmailDto,
    ConfirmNicknameDto,
    BadRequestException,
    SendPasswordDto,
    ResetPasswordDto,
    UnkownError,
} from "../../models/_.loader";
import { Dayjs } from "dayjs";

export class AuthService {
    private jwtProvider: JwtProvider;
    private mysqlProvider: MysqlProvider;
    private sesProvider: AwsSesProvider;
    private bcryptProvider: BcryptProvider;
    private dateProvider: DateProvider;
    private dayjsProvider: DayjsProvider;
    private randomGenerator: RandomGenerator;

    private authRepository: AuthRepository;
    private authVerifyListRepository: AuthVerifyListRepository;

    constructor() {
        this.jwtProvider = new JwtProvider();
        this.mysqlProvider = new MysqlProvider();
        this.sesProvider = new AwsSesProvider();
        this.bcryptProvider = new BcryptProvider();
        this.dateProvider = new DateProvider();
        this.dayjsProvider = new DayjsProvider();

        this.authRepository = new AuthRepository();
        this.authVerifyListRepository = new AuthVerifyListRepository();
        this.randomGenerator = new RandomGenerator();
    }

    public signup = async (userDto: SignupUserDto): Promise<UserDto> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();
            userDto.password = this.bcryptProvider.hashPassword(userDto.password);

            const emailVerifyTokenPayload = this.jwtProvider.verifyToken<jwtLib.IEmailVerifyToken>(
                userDto.emailVerifyToken,
            );
            const nicknameVerifyTokenPayload = this.jwtProvider.verifyToken<jwtLib.INicknameVerifyToken>(
                userDto.nicknameVerifyToken,
            );

            const isExistsUser = await this.authRepository.isExistsByEmail(conn, emailVerifyTokenPayload.email);
            if (isExistsUser === true)
                throw new ConflictException(`${emailVerifyTokenPayload.email} 은 사용 중입니다.`);

            const finededVerifyList = await this.authVerifyListRepository.findVerifyListByEmail(
                conn,
                emailVerifyTokenPayload.email,
            );

            if (finededVerifyList === null)
                throw new NotFoundException(
                    `해당 이메일과 닉네임의 요청은 이미 만료되었습니다. 회원가입 절차를 다시 실행해주세요.`,
                );
            else if (
                finededVerifyList.emailVerifiedToken !== userDto.emailVerifyToken ||
                finededVerifyList.nicknameVerifiedToken !== userDto.nicknameVerifyToken
            )
                throw new BadRequestException(
                    `서버에 등록되어 있지 않은 EmailVerifyToken 혹은 NicknameVerifyToken 을 제출하였습니다.`,
                );

            const date = this.dayjsProvider.changeToProvidedFormat(
                this.dayjsProvider.getDayjsInstance(),
                this.dayjsProvider.getDayabaseFormat(),
            );
            await this.authRepository.createUser(
                conn,
                {
                    email: emailVerifyTokenPayload.email,
                    nickname: nicknameVerifyTokenPayload.nickname,
                    password: userDto.password,
                    imageGroup: {
                        imageUrl: userDto.imageUrl,
                        resizedUrl: userDto.resizedUrl,
                    },
                },
                date,
                finededVerifyList.userVerifyListId,
            );

            // const createdUserId = await this.authRepository.createUser(conn, userDto, date);

            await conn.rollback();

            return new UserDto({
                userId: 1,
                createdAt: date,
                updatedAt: date,
                email: emailVerifyTokenPayload.email,
                nickname: nicknameVerifyTokenPayload.nickname,
                imageUrl: userDto.imageUrl,
                resizedUrl: userDto.resizedUrl,
            });
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    public signin = async (
        userDto: SigninUserDto,
    ): Promise<{
        accessToken: string;
        refreshToken: string;
    }> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();

            const findedUser = await this.authRepository.findUserByEmail(conn, userDto.email);
            if (findedUser === null) throw new NotFoundException(`${userDto.email} 은 존재하지 않는 이메일입니다.`);

            const isSamePassword = await this.bcryptProvider.comparedPassword(userDto.password, findedUser.password);
            if (isSamePassword === false)
                throw new ForBiddenException(`${userDto.email} 와 일치하지 않는 비밀번호 입니다.`);

            const accessToken = this.jwtProvider.signAccessToken({
                type: "AccessToken",
                userId: findedUser.userId,
                nickname: findedUser.nickname,
            });
            const refreshToken = this.jwtProvider.signRefreshToken({
                type: "RefreshToken",
                userId: findedUser.userId,
                nickname: findedUser.nickname,
                email: findedUser.email,
                imageUrl: findedUser.imageUrl,
            });

            await this.authRepository.updateUserRefreshToken(conn, findedUser.userId, refreshToken);

            await conn.commit();
            return {
                accessToken,
                refreshToken,
            };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    public logout = async (logoutDto: LogoutUserDto): Promise<void> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();

            const payload = this.jwtProvider.decodeToken<jwtLib.IRefreshTokenPayload>(logoutDto.refreshToken);
            const userId = payload.userId;

            const findedUser = await this.authRepository.findUserById(conn, userId);
            if (findedUser === null) throw new NotFoundException(`존재하지 않는 사용자의 토큰을 제출하셨습니다.`);

            await this.authRepository.updateUserRefreshToken(conn, userId, null);

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    public publishToken = async (tokenDto: PublishTokenDto): Promise<string> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();

            const payload = this.jwtProvider.decodeToken<jwtLib.IRefreshTokenPayload>(tokenDto.refreshToken);
            const isExists = await this.authRepository.isExistsById(conn, payload.userId);
            if (isExists === false) throw new NotFoundException(`이미 탈퇴한 사용자의 토큰입니다.`);

            const userToken = await this.authRepository.findUserRefreshTokenById(conn, payload.userId);
            if (userToken === null) throw new NotFoundException(`이미 탈퇴한 사용자의 토큰입니다.`);

            const serverToken = userToken.refreshToken;
            if (serverToken === undefined) throw new NotFoundException(`로그인 기록이 없는 사용자입니다.`);
            if (tokenDto.refreshToken !== serverToken)
                throw new NotFoundException(`등록되지 않은 RefreshToken 입니다.`);

            const accessToken = this.jwtProvider.signAccessToken({
                type: "AccessToken",
                userId: payload.userId,
                nickname: payload.nickname,
            });
            await conn.commit();

            return accessToken;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    public sendEmail = async (
        sendEmailDto: SendEmailDto,
    ): Promise<{
        isExceeded: boolean;
        exceededDate:
            | {
                  lastSentDate: string;
                  accessibleDate: string;
              }
            | undefined;
        email: string;
        date: string;
    }> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();

            const isExistsUser = await this.authRepository.isExistsByEmail(conn, sendEmailDto.email);
            if (isExistsUser) throw new ConflictException(`${sendEmailDto.email} 은 이미 가입한 이메일입니다.`);

            const emailVerifyCode = this.randomGenerator.getRandomVerifyCode();

            const findedUserVerifyList = await this.authVerifyListRepository.findVerifyListByEmail(
                conn,
                sendEmailDto.email,
            );

            const nowDayjsInstance: Dayjs = this.dayjsProvider.getDayjsInstance();
            const nowDateString = this.dayjsProvider.changeToProvidedFormat(nowDayjsInstance, "YYYY년 MM월 DD일 hh:mm");

            if (findedUserVerifyList === null) {
                await this.authVerifyListRepository.createVerifyListByEmailAndCode(
                    conn,
                    sendEmailDto.email,
                    emailVerifyCode,
                );
            } else {
                // 일일 이메일 발송 제한 초과의 경우
                if (
                    findedUserVerifyList.isExeededOfEmailSent === 1 ||
                    findedUserVerifyList.currentEmailSentCount >= 5
                ) {
                    const diffMilliSeconds = this.dayjsProvider.getDiffMIlliSeconds(
                        findedUserVerifyList.emailSentExceedingDate,
                        nowDayjsInstance,
                        {
                            limitCount: 2,
                            limitType: "day",
                        },
                    );

                    const lastSentDateString = this.dayjsProvider.changeToProvidedFormat(
                        findedUserVerifyList.emailSentExceedingDate ?? nowDayjsInstance,
                        "YYYY년 MM월 DD일 hh:mm",
                    );
                    const accessibleDateString = this.dayjsProvider.changeToProvidedFormat(
                        this.dayjsProvider.getAddTime(nowDayjsInstance, {
                            limitCount: 2,
                            limitType: "day",
                        }),
                        "YYYY년 MM월 DD일 hh:mm",
                    );

                    if (diffMilliSeconds < 0)
                        return {
                            isExceeded: true,
                            exceededDate: {
                                lastSentDate: lastSentDateString,
                                accessibleDate: accessibleDateString,
                            },
                            email: sendEmailDto.email,
                            date: nowDateString,
                        };

                    const nowDateDbString = this.dayjsProvider.changeToProvidedFormat(
                        nowDayjsInstance,
                        "YYYY-MM-DD hh:mm:ss",
                    );
                    await this.authVerifyListRepository.exceedOfEmailSent(
                        conn,
                        findedUserVerifyList.userVerifyListId,
                        nowDateDbString,
                    );

                    return {
                        isExceeded: true,
                        exceededDate: {
                            lastSentDate: lastSentDateString,
                            accessibleDate: accessibleDateString,
                        },
                        email: sendEmailDto.email,
                        date: nowDateString,
                    };
                }

                // 일일 이메일 발송 제한 초과의 X 경우
                if (findedUserVerifyList.isVerifiedEmail === 1) {
                    // 회원가입 직전 까지 인증 절차를 따라간 사용자
                    await this.authVerifyListRepository.reUpdateVerifyListByIdAndCode(
                        conn,
                        findedUserVerifyList.userVerifyListId,
                        emailVerifyCode,
                    );
                } else {
                    // 최초 인증을 진행하는 사용자
                    await this.authVerifyListRepository.updateVerifyListByIdAndCode(
                        conn,
                        findedUserVerifyList.userVerifyListId,
                        emailVerifyCode,
                    );
                }
            }

            const expiredDateString = this.dayjsProvider.changeToProvidedFormat(
                this.dayjsProvider.getAddTime(nowDayjsInstance, {
                    limitCount: 3,
                    limitType: "m",
                }),
                "YYYY년 MM월 DD일 hh:mm",
            );

            const remainingEmailSentChance = 5 - (findedUserVerifyList?.currentEmailSentCount ?? 0 + 1);
            await this.sesProvider.sendVerifyCode(sendEmailDto.email, emailVerifyCode, remainingEmailSentChance, {
                publishedDate: nowDateString,
                expiredDate: expiredDateString,
            });

            await conn.commit();
            return {
                isExceeded: false,
                exceededDate: undefined,
                email: sendEmailDto.email,
                date: nowDateString,
            };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    public confirmEmailCode = async (
        confirmEmailDto: ConfirmEmailDto,
    ): Promise<{
        emailVerifyToken: string;
    }> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();

            const isExistsUser = await this.authRepository.isExistsByEmail(conn, confirmEmailDto.email);
            if (isExistsUser) throw new ConflictException(`${confirmEmailDto.email} 은 이미 가입한 이메일입니다.`);

            const findedVerifyList = await this.authVerifyListRepository.findVerifyListByEmail(
                conn,
                confirmEmailDto.email,
            );

            if (findedVerifyList === null) {
                throw new BadRequestException(`${confirmEmailDto.email} 은 인증번호 발송 과정이 진행되지 않았습니다.`);
            } else {
                if (findedVerifyList.emailVerifiedCode !== confirmEmailDto.emailVerifyCode)
                    throw new BadRequestException(`인증 번호가 틀렸습니다.`);

                const nowDayjsInstance = this.dayjsProvider.getDayjsInstance();

                const emailVerifyToken = this.jwtProvider.signEmailVerifyToken({
                    type: "EmailVerifyToken",
                    email: findedVerifyList.email,
                });

                const nowDayjsDbString = this.dayjsProvider.changeToProvidedFormat(
                    nowDayjsInstance,
                    "YYYY-MM-DD hh:mm:ss",
                );

                if (findedVerifyList.isVerifiedNickname === 1) {
                    await this.authVerifyListRepository.reUpdateVerifyListByEmailAndEmailVerifyToken(
                        conn,
                        confirmEmailDto.email,
                        nowDayjsDbString,
                        emailVerifyToken,
                    );
                } else {
                    await this.authVerifyListRepository.updateVerifyListByEmailAndEmailVerifyToken(
                        conn,
                        findedVerifyList.email,
                        nowDayjsDbString,
                        emailVerifyToken,
                    );
                }

                await conn.commit();
                return {
                    emailVerifyToken: emailVerifyToken,
                };
            }
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    public confirmNickname = async (
        confirmNicknameDto: ConfirmNicknameDto,
    ): Promise<{
        nicknameVerifyToken: string;
    }> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();

            const emailVerifyTokenPayload = await this.jwtProvider.verifyToken<jwtLib.IEmailVerifyToken>(
                confirmNicknameDto.emailVerifyToken,
            );

            const isExists = await this.authRepository.isExistsByNickname(conn, confirmNicknameDto.nickname);
            if (isExists) throw new ConflictException(`${confirmNicknameDto.nickname} 은 이미 가입한 닉네임입니다.`);

            const isExistsOthersNickname = await this.authVerifyListRepository.isExistsByNicknameExceptEmail(
                conn,
                confirmNicknameDto.nickname,
                emailVerifyTokenPayload.email,
            );
            if (isExistsOthersNickname === true)
                throw new ConflictException(
                    `${confirmNicknameDto.nickname} 은 다른 사람이 중복 확인 중인 닉네임입니다.`,
                );

            const findedVerifyList = await this.authVerifyListRepository.findVerifyListByEmail(
                conn,
                emailVerifyTokenPayload.email,
            );
            if (findedVerifyList === null)
                throw new NotFoundException(
                    `${emailVerifyTokenPayload.email} 은 인증번호 발송 과정이 진행되지 않았습니다.`,
                );
            if (findedVerifyList.isVerifiedEmail === 0)
                throw new BadRequestException(
                    `${emailVerifyTokenPayload.email} 은 인증번호 확인 과정이 진행되지 않았습니다.`,
                );

            const nowDayjsInstance = this.dayjsProvider.getDayjsInstance();
            const nicknameVerifyToken = this.jwtProvider.signNicknameVerifyToken({
                type: "NicknameVerifyToken",
                nickname: confirmNicknameDto.nickname,
            });

            const nowDayjsDbString = this.dayjsProvider.changeToProvidedFormat(nowDayjsInstance, "YYYY-MM-DD hh:mm:ss");
            await this.authVerifyListRepository.updateVerifyListByNickname(
                conn,
                emailVerifyTokenPayload.email,
                confirmNicknameDto.nickname,
                nowDayjsDbString,
                nicknameVerifyToken,
            );

            await conn.commit();
            return {
                nicknameVerifyToken,
            };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    public sendPassword = async (
        sendPasswordDto: SendPasswordDto,
    ): Promise<{
        isExceeded: boolean;
        exceededDate:
            | {
                  lastSentDate: string;
                  accessibleDate: string;
              }
            | undefined;
        email: string;
        date: string;
    }> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();

            const findedUser = await this.authRepository.findUserByEmail(conn, sendPasswordDto.email);
            if (findedUser === null)
                throw new NotFoundException(`${sendPasswordDto.email} 은 존재하지 않는 이메일입니다.`);

            const randomPassword = this.randomGenerator.getRandomPassword();
            const hashedPassword = await this.bcryptProvider.hashPassword(randomPassword);
            const resetPasswordToken = this.jwtProvider.signResetPasswordToken({
                type: "ResetPasswordToken",
                email: sendPasswordDto.email,
                hashedPassword: hashedPassword,
            });

            const nowDaysInstance = this.dayjsProvider.getDayjsInstance();
            const nowDaysDbString = this.dayjsProvider.changeToProvidedFormat(nowDaysInstance, "YYYY-MM-DD hh:mm:ss");

            console.log(findedUser);
            if (findedUser.isExeededOfPasswordSent === 1 || findedUser.currentPasswordSentCount >= 5) {
                await this.authRepository.exceedOfResetPasswordSent(conn, findedUser.userId, nowDaysDbString);

                await conn.commit();
                return {
                    isExceeded: true,
                    date: this.dayjsProvider.changeToProvidedFormat(nowDaysInstance, "YYYY년 MM월 DD일 hh:mm"),
                    email: sendPasswordDto.email,
                    exceededDate: {
                        lastSentDate: this.dayjsProvider.changeToProvidedFormat(
                            findedUser.passwordSentExceedingDate ?? nowDaysDbString,
                            "YYYY년 MM월 DD일 hh:mm",
                        ),
                        accessibleDate: this.dayjsProvider.changeToProvidedFormat(
                            this.dayjsProvider.getAddTime(findedUser.passwordSentExceedingDate ?? nowDaysDbString, {
                                limitCount: 2,
                                limitType: "day",
                            }),
                            "YYYY년 MM월 DD일 hh:mm",
                        ),
                    },
                };
            } else {
                await this.authRepository.updateUserResetPassword(
                    conn,
                    findedUser.userId,
                    resetPasswordToken,
                    nowDaysDbString,
                );
                const nowDaysClientString = this.dayjsProvider.changeToProvidedFormat(
                    nowDaysDbString,
                    "YYYY년 MM월 DD일 hh:mm",
                );
                const expiredDaysClientString = this.dayjsProvider.changeToProvidedFormat(
                    this.dayjsProvider.getAddTime(nowDaysInstance, {
                        limitCount: 2,
                        limitType: "day",
                    }),
                    "YYYY년 MM월 DD일 hh:mm",
                );
                const remainingEmailSentChance = 5 - (findedUser?.currentEmailSentCount ?? 0 + 1);
                await this.sesProvider.sendTempPassword(
                    sendPasswordDto.email,
                    randomPassword,
                    resetPasswordToken,
                    remainingEmailSentChance,
                    {
                        publishedDate: nowDaysClientString,
                        expiredDate: expiredDaysClientString,
                    },
                );

                await conn.commit();
                return {
                    isExceeded: false,
                    date: nowDaysClientString,
                    email: sendPasswordDto.email,
                    exceededDate: undefined,
                };
            }
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    public resetPassword = async (resetPasswordDto: ResetPasswordDto): Promise<string> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();

            const payload = this.jwtProvider.verifyToken<jwtLib.IResetPasswordToken>(
                resetPasswordDto.resetPasswordToken,
            );
            payload.email;
            payload.hashedPassword;

            const findedUser = await this.authRepository.findUserByEmail(conn, payload.email);
            if (findedUser === null) throw new NotFoundException(`${payload.email} 은 존재하지 않는 이메일입니다.`);

            await this.authRepository.updateUserPassword(conn, payload.email, payload.hashedPassword);

            await conn.commit();
            return payload.email;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };
}
