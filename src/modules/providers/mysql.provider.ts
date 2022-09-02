import * as mysql from "mysql2/promise";
import { CustomException, DatabaseConnectionError, IMysqlEnv, UnkownTypeError } from "../../models/_.loader";

export class MysqlProvider {
    static isInit = false;
    static pool: mysql.Pool;

    static init = ({ HOST, USER, DATABASE, PASSWORD, CONNECTION_LIMIT }: IMysqlEnv) => {
        if (this.isInit === true) return;

        this.pool = mysql.createPool({
            host: HOST,
            user: USER,
            database: DATABASE,
            password: PASSWORD,
            connectionLimit: CONNECTION_LIMIT,
        });
        this.validateConnetion(this.pool);
        this.isInit = true;
    };

    static validateConnetion = async (pool: mysql.Pool) => {
        try {
            await pool.getConnection();
        } catch (err) {
            throw err;
        }
    };

    /** @throws { CustomException } */
    public getConnection = async () => {
        this.validateIsInit();

        try {
            return await MysqlProvider.pool.getConnection();
        } catch (err) {
            throw this.errorHandler(err);
        }
    };

    private validateIsInit = () => {
        if (MysqlProvider.isInit === false) throw new Error("MysqlProvider는 init 전 사용할 수 없어요.");
    };

    private errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new DatabaseConnectionError(err.message);
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };
}
