import { PoolConnection, ResultSetHeader } from "mysql2/promise";

import { ERecipeSize, ERecipeTemperature, ERecipeCategory, UnkownError } from "../../models/_.loader";

export class UserFavorRepository {
    // Favor

    /**
     * `INSERT INTO user_favor_cup_size_list (user_id, cup_size) VALUES (?, ?), ...(?, ?);`
     */
    public insertFavorCupSize = async (
        conn: PoolConnection,
        userId: number,
        favorCupSizeList: ERecipeSize[],
    ): Promise<null | ResultSetHeader> => {
        const cupSizeListLength = favorCupSizeList?.length;

        if (cupSizeListLength === 0) return null;

        let insertQuery = `INSERT INTO user_favor_cup_size_list (user_id, cup_size) VALUES `;
        for (const cupSize of favorCupSizeList) {
            insertQuery += `(${userId}, "${cupSize}"), `;
        }
        insertQuery = insertQuery.slice(0, insertQuery.length - 1) + ";";

        const insertResult = await conn.query<ResultSetHeader>(insertQuery);
        const [resultSetHeader] = insertResult;

        if (resultSetHeader.affectedRows !== cupSizeListLength)
            throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.", "DATABASE_UNKOWN_QUERY");

        return resultSetHeader;
    };

    /**
     * `INSERT INTO user_favor_temperature_list (user_id, state) VALUES (?, ?), ...(?, ?);`
     */
    public insertFavorTemperature = async (
        conn: PoolConnection,
        userId: number,
        favorTemperatureList: ERecipeTemperature[],
    ) => {
        const tmperatureListLength = favorTemperatureList?.length;

        if (tmperatureListLength === 0) return null;

        let insertQuery = `INSERT INTO user_favor_temperature_list (user_id, state) VALUES `;
        for (const state of favorTemperatureList) {
            insertQuery += `(${userId}, "${state}"), `;
        }
        insertQuery = insertQuery.slice(0, insertQuery.length - 1) + ";";

        const insertResult = await conn.query<ResultSetHeader>(insertQuery);
        const [resultSetHeader] = insertResult;

        if (resultSetHeader.affectedRows !== tmperatureListLength)
            throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.", "DATABASE_UNKOWN_QUERY");

        return resultSetHeader;
    };

    /**
     * `INSERT INTO user_favor_category_list_list (user_id, category_name) VALUES (?, ?), ...(?, ?);`
     */
    public insertFavorCategory = async (conn: PoolConnection, userId: number, favorCategoryList: ERecipeCategory[]) => {
        const categoryListLength = favorCategoryList?.length;

        if (categoryListLength === 0) return null;

        let insertQuery = `INSERT INTO user_favor_category_list_list (user_id, category_name) VALUES `;
        for (const category of favorCategoryList) {
            insertQuery += `(${userId}, "${category}"), `;
        }
        insertQuery = insertQuery.slice(0, insertQuery.length - 1) + ";";

        const insertResult = await conn.query<ResultSetHeader>(insertQuery);
        const [resultSetHeader] = insertResult;

        if (resultSetHeader.affectedRows !== categoryListLength)
            throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.", "DATABASE_UNKOWN_QUERY");

        return resultSetHeader;
    };

    // Disfavor

    /**
     * `INSERT INTO user_disfavor_cup_size_list (user_id, cup_size) VALUES (?, ?), ...(?, ?);`
     */
    public insertDisfavorCupSize = async (
        conn: PoolConnection,
        userId: number,
        disfavorCupSizeList: ERecipeSize[],
    ): Promise<null | ResultSetHeader> => {
        const cupSizeListLength = disfavorCupSizeList?.length;

        if (cupSizeListLength === 0) return null;

        let insertQuery = `INSERT INTO user_disfavor_cup_size_list (user_id, cup_size) VALUES `;
        for (const cupSize of disfavorCupSizeList) {
            insertQuery += `(${userId}, "${cupSize}"), `;
        }
        insertQuery = insertQuery.slice(0, insertQuery.length - 1) + ";";

        const insertResult = await conn.query<ResultSetHeader>(insertQuery);
        const [resultSetHeader] = insertResult;

        if (resultSetHeader.affectedRows !== cupSizeListLength)
            throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.", "DATABASE_UNKOWN_QUERY");

        return resultSetHeader;
    };

    /**
     * `INSERT INTO user_disfavor_temperature_list (user_id, state) VALUES (?, ?), ...(?, ?);`
     */
    public insertDisfavorTemperature = async (
        conn: PoolConnection,
        userId: number,
        disfavorTemperatureList: ERecipeTemperature[],
    ) => {
        const tmperatureListLength = disfavorTemperatureList?.length;

        if (tmperatureListLength === 0) return null;

        let insertQuery = `INSERT INTO user_disfavor_temperature_list (user_id, state) VALUES `;
        for (const state of disfavorTemperatureList) {
            insertQuery += `(${userId}, "${state}"), `;
        }
        insertQuery = insertQuery.slice(0, insertQuery.length - 1) + ";";

        const insertResult = await conn.query<ResultSetHeader>(insertQuery);
        const [resultSetHeader] = insertResult;

        if (resultSetHeader.affectedRows !== tmperatureListLength)
            throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.", "DATABASE_UNKOWN_QUERY");

        return resultSetHeader;
    };

    /**
     * `INSERT INTO user_disfavor_category_list (user_id, category_name) VALUES (?, ?), ...(?, ?);`
     */
    public insertDisfavorCategory = async (
        conn: PoolConnection,
        userId: number,
        disfavorCategoryList: ERecipeCategory[],
    ) => {
        const categoryListLength = disfavorCategoryList?.length;

        if (categoryListLength === 0) return null;

        let insertQuery = `INSERT INTO user_disfavor_category_list (user_id, category_name) VALUES `;
        for (const category of disfavorCategoryList) {
            insertQuery += `(${userId}, "${category}"), `;
        }
        insertQuery = insertQuery.slice(0, insertQuery.length - 1) + ";";

        const insertResult = await conn.query<ResultSetHeader>(insertQuery);
        const [resultSetHeader] = insertResult;

        if (resultSetHeader.affectedRows !== categoryListLength)
            throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.", "DATABASE_UNKOWN_QUERY");

        return resultSetHeader;
    };
}
