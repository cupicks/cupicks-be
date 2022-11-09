import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { TBEDGE_CODE } from "../../constants/_.loader";
import { EBadgeCode } from "../../models/enums/e.badge.code";
import { IBedgePacket } from "../../models/_.loader";

export class BadgeRepository {
    /**
     * act_recipe_count
     */
    public increaeActRecipeCount(): void {
        //
    }

    public async findSingleBedgeByUserId(
        conn: PoolConnection,
        userId: number,
        bedgeCode: EBadgeCode,
    ): Promise<IBedgePacket | null> {
        const findQuery = `SELECT
            user_id as userId,
            bedge_name as bedgeName,
            created_at as createdAt
        FROM user_bedge_list WHERE user_id = ? AND bedge_name = ?;`;
        const findResult = await conn.query<IBedgePacket[]>(findQuery, [userId, bedgeCode]);

        const [findSetHeader] = findResult;

        const bedge = findSetHeader[0];

        return bedge ?? null;
    }

    public async findBedgeListByUserId(
        conn: PoolConnection,
        userId: number
    ): Promise<IBedgePacket[]> {
        const findQuery = `SELECT
            user_id as userId, bedge_name as bedgeName, created_at as createdAt
        FROM user_bedge_list WHERE user_id =?;`;

        const findResult = await conn.query<IBedgePacket[]>(findQuery, [userId]);
        const [findListPacket] = findResult;

        return findListPacket ?? [];
    }

    public async publishBedge(
        conn: PoolConnection,
        userId: number,
        bedgeCode: EBadgeCode,
        datetime: string,
    ): Promise<void> {
        const insertQuery = `INSERT INTO user_bedge_list (user_id, bedge_name, created_at) VALUES (?, ?, ?);`;
        await conn.query(insertQuery, [userId, bedgeCode, datetime]);
    }
}
