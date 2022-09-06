import * as jwtLib from "jsonwebtoken";
import { AuthRepository, AuthVerifyListRepository } from "../repositories/_.exporter";
import { AwsSesProvider, BcryptProvider, DateProvider, JwtProvider, MysqlProvider } from "../../modules/_.loader";
import {
    ConflictException,
    ForBiddenException,
    NotFoundException,
    SigninUserDto,
    SignupUserDto,
    UserDto,
    PublishTokenDto,
    ConfirmPasswordDto,
    SendEmailDto,
    ConfirmEmailDto,
    ConfirmNicknameDto,
    BadRequestException,
} from "../../models/_.loader";

export class AuthService {
    private jwtProvider: JwtProvider;
    private mysqlProvider: MysqlProvider;
    private sesProvider: AwsSesProvider;
    private bcryptProvider: BcryptProvider;
    private dateProvider: DateProvider;

    private authRepository: AuthRepository;
    private authVerifyListRepository: AuthVerifyListRepository;

    constructor() {
        this.jwtProvider = new JwtProvider();
        this.mysqlProvider = new MysqlProvider();
        this.sesProvider = new AwsSesProvider();
        this.bcryptProvider = new BcryptProvider();
        this.dateProvider = new DateProvider();

        this.authRepository = new AuthRepository();
        this.authVerifyListRepository = new AuthVerifyListRepository();
    }

    public signup = async (userDto: SignupUserDto): Promise<UserDto> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();
            userDto.password = this.bcryptProvider.hashPassword(userDto.password);

            const emailVerifyToken = this.jwtProvider.verifyToken<jwtLib.IEmailVerifyToken>(userDto.emailVerifyToken);
            const nicknameVerifyToken = this.jwtProvider.verifyToken<jwtLib.INicknameVerifyToken>(
                userDto.nicknameVerifyToken,
            );

            const isExistsUser = await this.authRepository.isExistsByEmail(conn, userDto.email);
            if (isExistsUser === true) throw new ConflictException(`${userDto.email} 은 사용 중입니다.`);

            const finededVerifyList = await this.authVerifyListRepository.findVerifyListByEmail(conn, userDto.email);
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

            const date = this.dateProvider.getNowDatetime();
            await this.authRepository.createUser(conn, userDto, date, finededVerifyList.userVerifyListId);

            // const createdUserId = await this.authRepository.createUser(conn, userDto, date);

            await conn.commit();

            return new UserDto({
                userId: 1,
                createdAt: date,
                updatedAt: date,
                ...userDto,
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
                throw new ForBiddenException(`${userDto.password} 와 일치하지 않는 비밀번호 입니다.`);

            const accessToken = this.jwtProvider.sign<jwtLib.IAccessTokenPayload>({
                type: "AccessToken",
                userId: findedUser.userId,
                nickname: findedUser.nickname,
            });
            const refreshToken = this.jwtProvider.sign<jwtLib.IRefreshTokenPayload>({
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

            const accessToken = this.jwtProvider.sign<jwtLib.IAccessTokenPayload>({
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

    public sendEmail = async (sendEmailDto: SendEmailDto): Promise<{ date: string }> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();

            const isExistsUser = await this.authRepository.isExistsByEmail(conn, sendEmailDto.email);
            if (isExistsUser) throw new ConflictException(`${sendEmailDto.email} 은 이미 가입한 이메일입니다.`);

            const emailVerifyCode = this.sesProvider.getRandomSixDigitsVerifiedCode();

            const findedUserVerifyList = await this.authVerifyListRepository.findVerifyListByEmail(
                conn,
                sendEmailDto.email,
            );

            if (findedUserVerifyList === null) {
                await this.authVerifyListRepository.createVerifyListByEmailAndCode(
                    conn,
                    sendEmailDto.email,
                    emailVerifyCode,
                );
            } else {
                if (findedUserVerifyList.isVerifiedEmail === 1)
                    throw new BadRequestException(
                        `${sendEmailDto.email} 은 ${findedUserVerifyList.emailVerifiedDate} 에 이미 인증이 완료된 사용자입니다.`,
                    );

                await this.authVerifyListRepository.updateVerifyListByIdAndCode(
                    conn,
                    findedUserVerifyList.userVerifyListId,
                    emailVerifyCode,
                );
            }

            const email = await this.sesProvider.sendVerifyCode(sendEmailDto.email, emailVerifyCode);
            console.log(email);

            await conn.commit();
            return {
                date: this.dateProvider.getNowDatetime(),
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

            const findedVerifyList = await this.authVerifyListRepository.findVerifyListByEmail(
                conn,
                confirmEmailDto.email,
            );

            if (findedVerifyList === null) {
                throw new BadRequestException(`${confirmEmailDto.email} 은 인증번호 발송 과정이 진행되지 않았습니다.`);
            } else {
                if (findedVerifyList.isVerifiedEmail === 1)
                    throw new BadRequestException(
                        `${findedVerifyList.email} 은 ${findedVerifyList.emailVerifiedDate} 에 이미 인증이 완료된 사용자입니다.`,
                    );
                if (findedVerifyList.emailVerifiedCode !== confirmEmailDto.emailVerifyCode)
                    throw new BadRequestException(`인증 번호가 틀렸습니다.`);

                const emailVerifyToken = this.jwtProvider.sign<jwtLib.IEmailVerifyToken>({
                    type: "EmailVerifyToken",
                    email: findedVerifyList.email,
                });

                const date = this.dateProvider.getNowDatetime();
                await this.authVerifyListRepository.updateVerifyListByEmailAndEmailVerifyToken(
                    conn,
                    findedVerifyList.email,
                    date,
                    emailVerifyToken,
                );

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

            const isExists = await this.authRepository.isExistsByNickname(conn, confirmNicknameDto.nickname);
            if (isExists) throw new ConflictException(`${confirmNicknameDto.nickname} 은 이미 가입한 닉네임입니다.`);

            const isExistsOthersNickname = await this.authVerifyListRepository.isExistsByNicknameExceptEmail(
                conn,
                confirmNicknameDto.nickname,
                confirmNicknameDto.email,
            );
            if (isExistsOthersNickname === true)
                throw new ConflictException(
                    `${confirmNicknameDto.nickname} 은 다른 사람이 중복 확인 중인 닉네임입니다.`,
                );

            const findedVerifyList = await this.authVerifyListRepository.findVerifyListByEmail(
                conn,
                confirmNicknameDto.email,
            );
            if (findedVerifyList === null)
                throw new NotFoundException(`${confirmNicknameDto.email} 은 인증번호 발송 과정이 진행되지 않았습니다.`);
            if (findedVerifyList.isVerifiedEmail === 0)
                throw new BadRequestException(
                    `${confirmNicknameDto.email} 은 인증번호 확인 과정이 진행되지 않았습니다.`,
                );

            const date = this.dateProvider.getNowDatetime();
            const nicknameVerifyToken = this.jwtProvider.sign<jwtLib.INicknameVerifyToken>({
                type: "NicknameVerifyToken",
                nickname: confirmNicknameDto.nickname,
            });
            await this.authVerifyListRepository.updateVerifyListByNickname(
                conn,
                confirmNicknameDto.email,
                confirmNicknameDto.nickname,
                date,
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

    public confirmPassword = async (confirmDto: ConfirmPasswordDto): Promise<void> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();

            const findedUser = await this.authRepository.findUserById(conn, confirmDto.userId);
            if (findedUser === null) throw new NotFoundException(`존재하지 않는 사용자의 토큰을 제출하셨습니다.`);

            const isSamePassword = await this.bcryptProvider.comparedPassword(confirmDto.password, findedUser.password);
            if (isSamePassword === false) throw new ForBiddenException(`사용자와 일치하지 않는 비밀번호 입니다.`);

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };
}
