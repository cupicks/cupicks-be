import { NotFoundException } from "models/_.loader";
import { MysqlProvider } from "../../modules/_.loader";
import { BedgeRepsitory, AuthRepository } from "../repositories/_.exporter"

export class BedgeService {

    private mysqlProvider: MysqlProvider;
    private authRepository: AuthRepository;
    private bedgeRepository: BedgeRepsitory;

    constructor() {
        this.mysqlProvider = new MysqlProvider();

        this.authRepository = new AuthRepository();
        this.bedgeRepository = new BedgeRepsitory();
    }


    public getBedgeList = async (userId: number) => {

        const conn = await this.mysqlProvider?.getConnection();

        try {
            await conn.beginTransaction();

            const isExists = await this.authRepository.isExistsById(conn, userId);
            if (isExists === false)
                throw new NotFoundException(`이미 탈퇴한 사용자의 AccessToken 입니다.`, "AUTH-007-01");

            const result = await this.bedgeRepository.findBedgeListByUserId(conn, userId);

            await conn.commit();

            return result;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn?.release();
        }
        return [{
            bedgeName: 'Sample Bedge'
        }]
    }
}