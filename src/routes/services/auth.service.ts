import { AuthRepository } from "../repositories/_.exporter";
import { BcryptProvider, MysqlProvider } from "../../modules/_.loader";
import { ConflictException, SigninUserDto, SignupUserDto, UnkownError, UserDto } from "../../models/_.loader";

export class AuthService {
    private mysqlProvider: MysqlProvider;
    private bcryptProvider: BcryptProvider;
    private authRepository: AuthRepository;

    constructor() {
        this.mysqlProvider = new MysqlProvider();
        this.bcryptProvider = new BcryptProvider();
        this.authRepository = new AuthRepository();
    }

    signup = async (userDto: SignupUserDto): Promise<UserDto> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.query("START TRANSACTION;");
            userDto.password = this.bcryptProvider.hashPassword(userDto.password);

            const date = new Date().toISOString().slice(0, 19).replace("T", " ");

            const isExistsUser = await this.authRepository.isExistsByEmail(conn, userDto.email);
            if (isExistsUser) throw new ConflictException(`${userDto.email} 은 사용 중입니다.`);

            const createdUserId = await this.authRepository.createUser(conn, userDto);

            await this.authRepository.createUserDetailByUserId(conn, createdUserId, userDto.password, date);
            await this.authRepository.createUserRefreshTokenRowByUserId(conn, createdUserId);

            await conn.query("COMMIT;");
            conn.release();

            return new UserDto({
                userId: createdUserId,
                createdAt: date,
                updatedAt: date,
                ...userDto,
            });
        } catch (err) {
            await conn.query("ROLLBACK;");
            conn.release();
            throw err;
        }
    };

    signin = async (userDto: SigninUserDto) => {
        const conn = await this.mysqlProvider.getConnection();

        try {
        } catch (err) {
            await conn.query("ROLLBACK;");
            conn.release();
            throw err;
        }
    };
}
