import * as jwtLib from "jsonwebtoken";

import {
    AuthRepository,
    AuthVerifyListRepository,
    UserCategoryRepository,
    UserFavorRepository,
} from "../repositories/_.exporter";
import {
    AwsSesProvider,
    BcryptProvider,
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
} from "../../models/_.loader";
import { Dayjs } from "dayjs";

export class AuthService {
    private jwtProvider: JwtProvider;
    private mysqlProvider: MysqlProvider;
    private sesProvider: AwsSesProvider;
    private bcryptProvider: BcryptProvider;
    private dayjsProvider: DayjsProvider;
    private randomGenerator: RandomGenerator;

    private authRepository: AuthRepository;
    private authVerifyListRepository: AuthVerifyListRepository;
    private userCategoryRepository: UserCategoryRepository;

    private userFavorRepository: UserFavorRepository;

    constructor() {
        this.jwtProvider = new JwtProvider();
        this.mysqlProvider = new MysqlProvider();
        this.sesProvider = new AwsSesProvider();
        this.bcryptProvider = new BcryptProvider();
        this.dayjsProvider = new DayjsProvider();

        this.randomGenerator = new RandomGenerator();

        this.authRepository = new AuthRepository();
        this.authVerifyListRepository = new AuthVerifyListRepository();

        this.userCategoryRepository = new UserCategoryRepository();
        this.userFavorRepository = new UserFavorRepository();
    }

    public signup = async (userDto: SignupUserDto): Promise<UserDto> => {
        const conn = await this.mysqlProvider?.getConnection();

        userDto.password = this.bcryptProvider.hashPassword(userDto.password);
        const {
            emailVerifyToken,
            nicknameVerifyToken,
            password,
            imageUrl,
            resizedUrl,
            favorCupSizeList,
            favorTemperatureList,
            favorCategoryList,
            disfavorCupSizeList,
            disfavorTemperatureList,
            disfavorCategoryList,
        } = userDto;

        try {
            await conn.beginTransaction();

            const emailVerifyTokenPayload = this.jwtProvider.verifyToken<jwtLib.IEmailVerifyToken>(emailVerifyToken);
            const nicknameVerifyTokenPayload =
                this.jwtProvider.verifyToken<jwtLib.INicknameVerifyToken>(nicknameVerifyToken);

            const { email } = emailVerifyTokenPayload;
            const { nickname } = nicknameVerifyTokenPayload;

            const userVerifyList = await this.authVerifyListRepository.findVerifyListByEmail(conn, email);
            if (userVerifyList === null)
                throw new BadRequestException(
                    `${email} 이메일 및 닉네임 인증 절차를 진행하지 않은 사용자입니다.`,
                    "AUTH-004",
                );
            else {
                const { emailVerifiedToken: dbEmailToken, nicknameVerifiedToken: dbNicknameToken } = userVerifyList;
                if (dbEmailToken !== emailVerifyToken)
                    throw new BadRequestException(`등록되지 않은 emailVerifyToken 입니다.`, "AUTH-005");
                if (dbNicknameToken !== nicknameVerifyToken)
                    throw new BadRequestException(`등록되지 않은 nicnameVerifyToken 입니다.`, "AUTH-006");
            }

            const isExistsUser = await this.authRepository.isExistsByEmail(conn, email);
            if (isExistsUser === true) throw new ConflictException(`${email} 은 사용 중입니다.`, "AUTH-001-01");

            const date = this.dayjsProvider.changeToProvidedFormat(
                this.dayjsProvider.getDayjsInstance(),
                this.dayjsProvider.getDayabaseFormat(),
            );
            const createdUserId = await this.authRepository.createUser(
                conn,
                { email, nickname, password, imageGroup: { imageUrl, resizedUrl } },
                date,
                userVerifyList.userVerifyListId,
            );

            await Promise.all([
                this.userFavorRepository.insertFavorCupSize(conn, createdUserId, favorCupSizeList),
                this.userFavorRepository.insertFavorCategory(conn, createdUserId, favorCategoryList),
                this.userFavorRepository.insertFavorTemperature(conn, createdUserId, favorTemperatureList),
                this.userFavorRepository.insertDisfavorCupSize(conn, createdUserId, disfavorCupSizeList),
                this.userFavorRepository.insertDisfavorCategory(conn, createdUserId, disfavorCategoryList),
                this.userFavorRepository.insertDisfavorTemperature(conn, createdUserId, disfavorTemperatureList),
            ]);

            // @depreacted
            // await this.userCategoryRepository.createFavorCategoryList(conn, createdUserId, favorCategory);
            // await this.userCategoryRepository.createDisfavorCategoryList(conn, createdUserId, disfavorCategory);

            await conn.commit();

            return new UserDto({
                userId: createdUserId,
                createdAt: date,
                updatedAt: date,
                email: email,
                nickname: nicknameVerifyTokenPayload.nickname,
                imageUrl,
                resizedUrl,
                favorCupSizeList,
                favorTemperatureList,
                favorCategoryList,
                disfavorCupSizeList,
                disfavorTemperatureList,
                disfavorCategoryList,
            });
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn?.release();
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
            if (findedUser === null)
                throw new NotFoundException(`${userDto.email} 은 존재하지 않는 이메일입니다.`, "AUTH-002");

            const isSamePassword = await this.bcryptProvider.comparedPassword(userDto.password, findedUser.password);
            if (isSamePassword === false)
                throw new ForBiddenException(`${userDto.email} 와 일치하지 않는 비밀번호 입니다.`, "AUTH-003");

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
                // imageUrl: findedUser.imageUrl,
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
            if (findedUser === null)
                throw new NotFoundException(`이미 탈퇴한 사용자의 RefreshToken 입니다.`, "AUTH-007-02");

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
            if (isExists === false)
                throw new NotFoundException(`이미 탈퇴한 사용자의 RefreshToken 입니다.`, "AUTH-007-02");

            const userToken = await this.authRepository.findUserRefreshTokenById(conn, payload.userId);
            if (userToken === null)
                throw new NotFoundException(`이미 탈퇴한 사용자의 RefreshToken 입니다.`, "AUTH-007-02");

            const serverToken = userToken.refreshToken;
            if (serverToken === undefined) throw new NotFoundException(`로그인 기록이 없는 사용자입니다.`, "AUTH-008");
            if (tokenDto.refreshToken !== serverToken)
                throw new NotFoundException(`등록되지 않은 RefreshToken 입니다.`, "AUTH-008");

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
        email: string;
        date: string;
        exceededDate:
            | {
                  lastSentDate: string;
                  accessibleDate: string;
              }
            | undefined;
    }> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();

            const { email } = sendEmailDto;
            const isExistsUser = await this.authRepository.isExistsByEmail(conn, email);
            if (isExistsUser === true)
                throw new ConflictException(`${sendEmailDto.email} 은 이미 가입한 이메일입니다.`, "AUTH-001-01");

            const nowDayjsInstance: Dayjs = this.dayjsProvider.getDayjsInstance();
            const nowDbDate: string = this.dayjsProvider.changeToProvidedFormat(
                nowDayjsInstance,
                "YYYY-MM-DD hh:mm:ss",
            );
            const nowClientDate: string = this.dayjsProvider.changeToProvidedFormat(
                nowDayjsInstance,
                "YYYY년 MM월 DD일 hh:mm",
            );

            const emailVerifyCode = this.randomGenerator.getRandomVerifyCode();
            const userVerifyList = await this.authVerifyListRepository.findVerifyListByEmail(conn, email);

            // step 2
            const isFirstVerifiedEMail = userVerifyList === null;
            if (isFirstVerifiedEMail) {
                // 신규 인증 진입
                await this.authVerifyListRepository.createVerifyListByEmailAndCode(conn, email, emailVerifyCode);
            } else {
                // 일일 이메일 발송 제한 초과의 경우
                const { userVerifyListId, isExeededOfEmailSent, currentEmailSentCount, emailSentExceedingDate } =
                    userVerifyList;
                const lastSendDate = this.dayjsProvider.changeToProvidedFormat(
                    emailSentExceedingDate ?? nowDayjsInstance,
                    "YYYY년 MM월 DD일 hh:mm",
                );
                const accessibleDate = this.dayjsProvider.changeToProvidedFormat(
                    this.dayjsProvider.getAddTime(nowDayjsInstance, {
                        limitCount: 1,
                        limitType: "day",
                    }),
                    "YYYY년 MM월 DD일 hh:mm",
                );

                const isExeededLast = isExeededOfEmailSent === 1;
                if (isExeededLast) {
                    // console.log("2 depth 조건문 B-a : 제한일까지 사용 금지");
                    const banDate = this.dayjsProvider.getDiffMIlliSeconds(emailSentExceedingDate, nowDayjsInstance, {
                        limitCount: 1,
                        limitType: "day",
                    });
                    const isAlreadyBanned = banDate > 0;
                    if (isAlreadyBanned)
                        throw new BadRequestException(
                            `사용자 이메일로 일일 이메일 제한 횟수 5회를 초과했어요!\n24 시간 뒤에 다시 신청해주세요!`,
                            "AUTH-004-EXP-01",
                            {
                                exceededDate: {
                                    lastSentDate: lastSendDate,
                                    accessibleDate,
                                },
                                date: nowClientDate,
                            },
                        );

                    await this.authVerifyListRepository.disableExceedOfEmailSent(conn, userVerifyListId);
                }

                // 일일 이메일 발송 제한 초과의 경우
                const isExceededNow = currentEmailSentCount >= 5;
                if (isExceededNow) {
                    await this.authVerifyListRepository.exceedOfEmailSent(
                        conn,
                        userVerifyList.userVerifyListId,
                        nowDbDate,
                    );
                    throw new BadRequestException(
                        `사용자 이메일로 일일 이메일 제한 횟수 5회를 초과했어요!\n24 시간 뒤에 다시 신청해주세요!`,
                        "AUTH-004-EXP-01",
                        {
                            exceededDate: {
                                lastSentDate: lastSendDate,
                                accessibleDate,
                            },
                            date: nowClientDate,
                        },
                    );
                }

                // 최초 인증을 진행하는 사용자
                // console.log("2 depth 조건문 B-c");
                await this.authVerifyListRepository.updateVerifyListByIdAndCode(
                    conn,
                    userVerifyListId,
                    emailVerifyCode,
                );
            }

            const expiredDateString = this.dayjsProvider.changeToProvidedFormat(
                this.dayjsProvider.getAddTime(nowDayjsInstance, {
                    limitCount: 3,
                    limitType: "m",
                }),
                "YYYY년 MM월 DD일 hh:mm",
            );
            const remainingEmailSendChance = 5 - (userVerifyList?.currentEmailSentCount ?? 0 + 1);
            await this.sesProvider.sendVerifyCode(email, emailVerifyCode, remainingEmailSendChance, {
                publishedDate: nowClientDate,
                expiredDate: expiredDateString,
            });

            await conn.commit();
            return {
                email,
                date: nowClientDate,
                exceededDate: undefined,
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

        const { email, emailVerifyCode } = confirmEmailDto;

        try {
            await conn.beginTransaction();

            const isExistsUser = await this.authRepository.isExistsByEmail(conn, email);
            if (isExistsUser === true)
                throw new ConflictException(`${email} 은 이미 가입한 이메일입니다.`, "AUTH-001-01");

            const userVerifyList = await this.authVerifyListRepository.findVerifyListByEmail(conn, email);

            const isPassedSendEmailProcess = userVerifyList === null;
            if (isPassedSendEmailProcess) {
                // console.log("1 depth 조건문 A : 이메일 미발송자 -> throw Error");
                throw new BadRequestException(`${email} 은 인증번호 발송 과정이 진행되지 않았습니다.`, "AUTH-004-01");
            } else {
                // console.log("1 depth 조건문 B : 이메일 발송자 -> pass");
                const { emailVerifiedCode: dbEmailVerifiedCode, isVerifiedEmail } = userVerifyList;

                if (dbEmailVerifiedCode !== emailVerifyCode)
                    throw new BadRequestException(`인증 번호가 틀렸습니다.`, "AUTH-004-02");

                const nowDayjs = this.dayjsProvider.getDayjsInstance();
                const emailVerifyToken = this.jwtProvider.signEmailVerifyToken({ type: "EmailVerifyToken", email });
                const nowDayjsDbString = this.dayjsProvider.changeToProvidedFormat(nowDayjs, "YYYY-MM-DD hh:mm:ss");

                if (isVerifiedEmail === 1) {
                    // console.log("2 depth 조건문 B-a : 닉네임 중복확인 진행자 -> 닉네임 중복확인 부분 초기화");
                    await this.authVerifyListRepository.reUpdateVerifyListByEmailAndEmailVerifyToken(
                        conn,
                        email,
                        nowDayjsDbString,
                        emailVerifyToken,
                    );
                } else {
                    // console.log("2 depth 조건문 B-a : 닉네임 중복확인 미진행자 -> pass");
                    await this.authVerifyListRepository.updateVerifyListByEmailAndEmailVerifyToken(
                        conn,
                        email,
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
            if (isExists === true)
                throw new ConflictException(
                    `${confirmNicknameDto.nickname} 은 이미 가입한 닉네임입니다.`,
                    "AUTH-001-02",
                );

            const isExistsOthersNickname = await this.authVerifyListRepository.isExistsByNicknameExceptEmail(
                conn,
                confirmNicknameDto?.nickname,
                emailVerifyTokenPayload?.email,
            );
            if (isExistsOthersNickname === true)
                throw new ConflictException(
                    `${confirmNicknameDto.nickname} 은 다른 사람이 중복 확인 중인 닉네임입니다.`,
                    "AUTH-004-03",
                );

            const findedVerifyList = await this.authVerifyListRepository.findVerifyListByEmail(
                conn,
                emailVerifyTokenPayload?.email,
            );
            if (findedVerifyList === null)
                throw new NotFoundException(
                    `${emailVerifyTokenPayload?.email} 은 인증번호 발송 과정이 진행되지 않았습니다.`,
                    "AUTH-004-01",
                );
            if (findedVerifyList.isVerifiedEmail === 0)
                throw new BadRequestException(
                    `${emailVerifyTokenPayload?.email} 은 인증번호 확인 과정이 진행되지 않았습니다.`,
                    "AUTH-004-04",
                );

            const nowDayjsInstance = this.dayjsProvider.getDayjsInstance();
            const nicknameVerifyToken = this.jwtProvider.signNicknameVerifyToken({
                type: "NicknameVerifyToken",
                nickname: confirmNicknameDto.nickname,
            });

            const nowDayjsDbString = this.dayjsProvider.changeToProvidedFormat(nowDayjsInstance, "YYYY-MM-DD hh:mm:ss");
            await this.authVerifyListRepository.updateVerifyListByNickname(
                conn,
                emailVerifyTokenPayload?.email,
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
        date: string;
        email: string;
        exceededDate:
            | {
                  lastSentDate: string;
                  accessibleDate: string;
              }
            | undefined;
    }> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();

            const findedUser = await this.authRepository.findUserByEmail(conn, sendPasswordDto.email);
            if (findedUser === null)
                throw new NotFoundException(`${sendPasswordDto.email} 은 존재하지 않는 이메일입니다.`, "AUTH-002");

            const randomPassword = this.randomGenerator.getRandomPassword();
            const hashedPassword = await this.bcryptProvider.hashPassword(randomPassword);
            const resetPasswordToken = this.jwtProvider.signResetPasswordToken({
                type: "ResetPasswordToken",
                email: sendPasswordDto.email,
                hashedPassword: hashedPassword,
            });

            const nowDaysInstance = this.dayjsProvider.getDayjsInstance();
            const nowDaysDbString = this.dayjsProvider.changeToProvidedFormat(nowDaysInstance, "YYYY-MM-DD hh:mm:ss");

            if (findedUser.isExeededOfPasswordSent === 1 || findedUser.currentPasswordSentCount >= 4) {
                await this.authRepository.exceedOfResetPasswordSent(conn, findedUser.userId, nowDaysDbString);

                await conn.commit();
                const lastSentDate = this.dayjsProvider.changeToProvidedFormat(
                    findedUser.passwordSentExceedingDate ?? nowDaysDbString,
                    "YYYY년 MM월 DD일 hh:mm",
                );
                const accessibleDate = this.dayjsProvider.changeToProvidedFormat(
                    this.dayjsProvider.getAddTime(findedUser.passwordSentExceedingDate ?? nowDaysDbString, {
                        limitCount: 2,
                        limitType: "day",
                    }),
                    "YYYY년 MM월 DD일 hh:mm",
                );
                const date = this.dayjsProvider.changeToProvidedFormat(nowDaysInstance, "YYYY년 MM월 DD일 hh:mm");
                throw new BadRequestException(
                    "사용자 이메일로 일일 이메일 제한 횟수 5회를 초과했어요!\n24 시간 뒤에 다시 신청해주세요!",
                    "AUTH-004-EXP-02",
                    {
                        date,
                        exceededDate: {
                            lastSentDate,
                            accessibleDate,
                        },
                    },
                );
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
                    email: sendPasswordDto.email,
                    date: nowDaysClientString,
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

    public resetPassword = async (
        resetPasswordDto: ResetPasswordDto,
    ): Promise<{
        accessToken: string;
        refreshToken: string;
    }> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();

            const payload = this.jwtProvider.verifyToken<jwtLib.IResetPasswordToken>(
                resetPasswordDto.resetPasswordToken,
            );

            const findedUser = await this.authRepository.findUserByEmail(conn, payload.email);
            if (findedUser === null)
                throw new NotFoundException(`${payload.email} 은 존재하지 않는 이메일입니다.`, "AUTH-001-02");

            await this.authRepository.updateUserPassword(conn, payload.email, payload.hashedPassword);

            const accessToken = this.jwtProvider.signAccessToken({
                type: "AccessToken",
                userId: findedUser.userId,
                nickname: findedUser.nickname,
            });

            const refreshToken = this.jwtProvider.signRefreshToken({
                type: "RefreshToken",
                email: findedUser.email,
                userId: findedUser.userId,
                nickname: findedUser.nickname,
            });

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
}
