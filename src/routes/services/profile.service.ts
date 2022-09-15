import { AuthRepository } from "../repositories/auth.repository";
import { BcryptProvider, MulterProvider, MysqlProvider } from "../../modules/_.loader";
import { EditProfileDto, IUserPacket, NotFoundException } from "../../models/_.loader";

export class ProfileService {
    private mysqlProvider: MysqlProvider;
    private bcryptProvider: BcryptProvider;
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
        this.bcryptProvider = new BcryptProvider();
        this.mysqlProvider = new MysqlProvider();
    }

    public getAllProfile = async (): Promise<IUserPacket[]> => {
        const conn = await this.mysqlProvider.getConnection();

        return await this.authRepository.findAllUser(conn);
    };

    public editProfile = async (editDto: EditProfileDto): Promise<void> => {
        // 유저 있는 지 확인
        const conn = await this.mysqlProvider.getConnection();

        try {
            await conn.beginTransaction();

            if (editDto.password) editDto.password = this.bcryptProvider.hashPassword(editDto.password);

            const isExists = await this.authRepository.isExistsById(conn, editDto.userId);
            if (isExists === false) throw new NotFoundException(`이미 탈퇴한 사용자의 토큰입니다.`);

            if (editDto.imageUrl && editDto.resizedUrl) {
                const imageKey = editDto.imageUrl.split("/")[4];
                const resizedKey = imageKey;
                MulterProvider.deleteImage(imageKey, "profile");
                MulterProvider.deleteImage(resizedKey, "profile-resized");
            }

            await this.authRepository.updateUserProfile(conn, editDto);

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };
}
