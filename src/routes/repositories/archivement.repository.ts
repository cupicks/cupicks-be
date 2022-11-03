import { EArchivementCode } from "../../models/enums/_.exporter";
import { IArchivementPacket } from "../../models/_.loader";
import { FieldPacket, PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";

export class ArchivementRepository {
    // Act Recipe

    public async isExistsActRecipeCount(conn: PoolConnection, userId: number) {
        const isExistsQuery = `SELECT user_id FROM user_archivement_list WHERE user_id = ? AND archivement_name = 'act_recipe_count';`;
        const isExistsResult = await conn.query<RowDataPacket[][]>(isExistsQuery, [userId]);

        const [rowDataPacket] = isExistsResult;
        return rowDataPacket?.length === 1;
    }

    /**
     * act_recipe_count
     */
    public async findActRecipeCount(conn: PoolConnection, userId: number): Promise<IArchivementPacket> {
        //
        const findQuery = `SELECT
            user_id as userId,
            archivement_name as archivementName,
            archivement_count as archivementCount,
            archivement_date as archivementDate
        FROM user_archivement_list WHERE user_id = ? AND archivement_name = 'act_recipe_count';`;
        const findResult = await conn.query<IArchivementPacket[]>(findQuery, [userId]);

        const [iArchivementPacketList] = findResult;
        const [findedArchivementRow] = iArchivementPacketList;
        return findedArchivementRow;
    }

    /**
     * act_recipe_count
     */
    public async increaseActRecipeCount(
        conn: PoolConnection,
        userId: number,
        target: EArchivementCode.레시피_작성_수,
        datetime: string,
    ) {
        const updateQuery = `UPDATE user_archivement_list SET archivement_count = archivement_count + 1, archivement_date = ? WHERE user_id = ? AND archivement_name = ?;`;
        await conn.query(updateQuery, [datetime, userId, target]);
    }

    /**
     * act_recipe_count
     */
    public async createActRecipeCount(
        conn: PoolConnection,
        userId: number,
        target: EArchivementCode.레시피_작성_수,
        datetime: string,
    ) {
        const insertQuery = `INSERT INTO user_archivement_list (user_id, archivement_name, archivement_count, archivement_date) VALUES (?, ?, ?, ?);`;
        await conn.query(insertQuery, [userId, target, 0 + 1, datetime]);
    }

    // Act Comment

    public async isExistsActCommentCount(conn: PoolConnection, userId: number) {
        const isExistsQuery = `SELECT user_id FROM user_archivement_list WHERE user_id = ? AND archivement_name = 'act_comment_count';`;
        const isExistsResult = await conn.query<RowDataPacket[][]>(isExistsQuery, [userId]);

        const [rowDataPacket] = isExistsResult;
        return rowDataPacket?.length === 1;
    }

    /**
     * act_comment_count
     */
    public async findActCommentCount(conn: PoolConnection, userId: number): Promise<IArchivementPacket> {
        //
        const findQuery = `SELECT
            user_id as userId,
            archivement_name as archivementName,
            archivement_count as archivementCount,
            archivement_date as archivementDate
        FROM user_archivement_list WHERE user_id = ? AND archivement_name = 'act_comment_count';`;
        const findResult = await conn.query<IArchivementPacket[]>(findQuery, [userId]);

        const [iArchivementPacketList] = findResult;
        const [findedArchivementRow] = iArchivementPacketList;
        return findedArchivementRow;
    }

    /**
     * act_comment_count
     */
    public async increaseActCommentCount(
        conn: PoolConnection,
        userId: number,
        target: EArchivementCode.댓글_작성_수,
        datetime: string,
    ) {
        const updateQuery = `UPDATE user_archivement_list SET archivement_count = archivement_count + 1, archivement_date = ? WHERE user_id = ? AND archivement_name = ?;`;
        await conn.query(updateQuery, [datetime, userId, target]);
    }

    /**
     * act_comment_count
     */
    public async createActCommentCount(
        conn: PoolConnection,
        userId: number,
        target: EArchivementCode.댓글_작성_수,
        datetime: string,
    ) {
        const insertQuery = `INSERT INTO user_archivement_list (user_id, archivement_name, archivement_count, archivement_date) VALUES (?, ?, ?, ?);`;
        await conn.query(insertQuery, [userId, target, 0 + 1, datetime]);
    }
}
