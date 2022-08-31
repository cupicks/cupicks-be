import { AuthRepository } from "../repositories/_.exporter";
import { MysqlProvider } from "../../modules/_.loader";
import { ConflictException, SignupUserDto, UnkownError } from "../../models/_.loader";

export class AuthService {
    private authRepository: AuthRepository;
    private mysqlProvider: MysqlProvider;

    constructor() {
        this.authRepository = new AuthRepository();
        this.mysqlProvider = new MysqlProvider();
    }

    signup = async (userDto: SignupUserDto): Promise<object> => {
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.query("START TRANSACTION;");

            const isExistsUser = await this.authRepository.isExistsByEmail(conn, userDto.email);
            if (isExistsUser) throw new ConflictException(`${userDto.email} 은 사용 중입니다.`);

            const createdUser = await this.authRepository.createUser(conn, userDto);
            if (createdUser === null)
                throw new UnkownError(`알 수 없는 이유로 ${userDto.email} 회원가입에 실패하였습니다.`);

            await conn.query("ROLLBACK;");
            conn.release();

            return createdUser;
        } catch (err) {
            await conn.query("ROLLBACK;");
            conn.release();
            throw err;
        }
    };
}
