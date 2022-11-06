import { MysqlProvider } from "../../modules/_.loader";
import { BedgeRepsitory } from "../repositories/bedge.repository"

export class BedgeService {

    private mysqlProvider: MysqlProvider;
    private bedgeRepository: BedgeRepsitory;

    constructor() {
        this.mysqlProvider = new MysqlProvider();
        this.bedgeRepository = new BedgeRepsitory();
    }


    public getBedgeList = async (userId: number) => {

        const conn = await this.mysqlProvider?.getConnection();

        try {
            await conn.beginTransaction();

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