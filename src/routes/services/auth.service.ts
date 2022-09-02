import * as jwtLib from "jsonwebtoken";
import { AuthRepository } from "../repositories/_.exporter";
import { BcryptProvider, JwtProvider, MysqlProvider } from "../../modules/_.loader";
import {
    ConflictException,
    ForBiddenException,
    NotFoundException,
    SigninUserDto,
    SignupUserDto,
    UserDto,
    PublishTokenDto,
} from "../../models/_.loader";

export class AuthService {
    private jwtProvider: JwtProvider;
    private mysqlProvider: MysqlProvider;
    private bcryptProvider: BcryptProvider;
    private authRepository: AuthRepository;

    constructor() {
        this.jwtProvider = new JwtProvider();
        this.mysqlProvider = new MysqlProvider();
        this.bcryptProvider = new BcryptProvider();
        this.authRepository = new AuthRepository();
    }

    public signup = async (userDto: SignupUserDto): Promise<UserDto> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();
            userDto.password = this.bcryptProvider.hashPassword(userDto.password);

            const date = new Date().toISOString().slice(0, 19).replace("T", " ");

            const isExistsUser = await this.authRepository.isExistsByEmail(conn, userDto.email);
            if (isExistsUser) throw new ConflictException(`${userDto.email} 은 사용 중입니다.`);

            const createdUserId = await this.authRepository.createUser(conn, userDto);

            await this.authRepository.createUserDetailByUserId(conn, createdUserId, date);
            await this.authRepository.createUserRefreshTokenRowByUserId(conn, createdUserId);

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
                userId: findedUser.userId,
            });
            const refreshToken = this.jwtProvider.sign<jwtLib.IRefreshTokenPayload>({
                userId: findedUser.userId,
                nickname: findedUser.nickname,
                email: findedUser.email,
            });

            await this.authRepository.updateUserRefreshTokenRowByUserId(conn, findedUser.userId, refreshToken);

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

            const accessToken = this.jwtProvider.sign<jwtLib.IAccessTokenPayload>({ userId: payload.userId });
            await conn.commit();

            return accessToken;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };
}
