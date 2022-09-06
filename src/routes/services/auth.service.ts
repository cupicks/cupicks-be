import * as jwtLib from "jsonwebtoken";
import { AuthRepository, AuthVerifyListRepository } from "../repositories/_.exporter";
import { AwsSesProvider, BcryptProvider, JwtProvider, MysqlProvider } from "../../modules/_.loader";
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
} from "../../models/_.loader";

export class AuthService {
    private jwtProvider: JwtProvider;
    private mysqlProvider: MysqlProvider;
    private sesProvider: AwsSesProvider;
    private bcryptProvider: BcryptProvider;
    private authRepository: AuthRepository;
    private authVerifyListRepository: AuthVerifyListRepository;

    constructor() {
        this.jwtProvider = new JwtProvider();
        this.mysqlProvider = new MysqlProvider();
        this.sesProvider = new AwsSesProvider();
        this.bcryptProvider = new BcryptProvider();
        this.authRepository = new AuthRepository();
        this.authVerifyListRepository = new AuthVerifyListRepository();
    }

    public signup = async (userDto: SignupUserDto): Promise<UserDto> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();
            userDto.password = this.bcryptProvider.hashPassword(userDto.password);

            const isExistsUser = await this.authRepository.isExistsByEmail(conn, userDto.email);
            if (isExistsUser) throw new ConflictException(`${userDto.email} 은 사용 중입니다.`);

            const date = new Date().toISOString().slice(0, 19).replace("T", " ");
            const createdUserId = await this.authRepository.createUser(conn, userDto, date);

            await conn.commit();

            return new UserDto({
                userId: createdUserId,
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

    public sendEmail = async (sendEmailDto: SendEmailDto) => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();

            const isExistsUser = await this.authRepository.isExistsByEmail(conn, sendEmailDto.email);
            if (isExistsUser) throw new ConflictException(`${sendEmailDto.email} 은 이미 가입한 이메일입니다.`);

            let emailVerifyCode = "";
            for (let i = 0; i < 6; i++) {
                emailVerifyCode += Math.floor(Math.random() * 10);
            }

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
                await this.authVerifyListRepository.updateVerifyListByIdAndCode(
                    conn,
                    findedUserVerifyList.userVerifyListId,
                    emailVerifyCode,
                );
            }

            this.sesProvider.sendVerifyCode(sendEmailDto.email, emailVerifyCode);

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    public confirmEmailCode = async (confirmEmailDto: ConfirmEmailDto) => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();
            await conn.commit();
            return {
                emailVerifyToken: "토큰",
            };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };
    public confirmNickname = async (confirmNicknameDto: ConfirmNicknameDto) => {
        console.log(confirmNicknameDto);

        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();
            await conn.commit();
            return {
                nicknameVerifyToken: "토큰",
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
