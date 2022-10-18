import { PoolConnection, ResultSetHeader } from "mysql2/promise";

import { UnkownError } from "../../models/_.loader";
import { ERecipeCategory } from "../../models/enums/e.recipe.category";

/**
 * @deprecated
 */
export class UserCategoryRepository {
    // CREATE
    public createFavorCategoryList = async (
        conn: PoolConnection,
        userId: number,
        favorCategoryList: ERecipeCategory[],
    ): Promise<{ insertId: number; affectedRows: number } | undefined> => {
        if (favorCategoryList.length === 0) return undefined;

        let createQuery = `INSERT INTO user_favor_category_list (user_id, category_name) VALUES`;
        for (const favorCategory of favorCategoryList) {
            createQuery += ` (${userId}, "${favorCategory}"),`;
        }
        createQuery = createQuery.slice(0, createQuery.length - 1) + ";";

        const createResult = await conn.query<ResultSetHeader>(createQuery);

        const [resultSetHeader] = createResult;
        const { affectedRows, insertId } = resultSetHeader;
        if (affectedRows !== favorCategoryList.length)
            throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.", "DATABASE_UNKOWN_QUERY");

        return {
            insertId,
            affectedRows,
        };
    };

    public createDisfavorCategoryList = async (
        conn: PoolConnection,
        userId: number,
        disfavorCategoryList: ERecipeCategory[],
    ): Promise<{ insertId: number; affectedRows: number } | undefined> => {
        if (disfavorCategoryList.length === 0) return undefined;

        let createQuery = `INSERT INTO user_disfavor_category_list (user_id, category_name) VALUES`;
        for (const favorCategory of disfavorCategoryList) {
            createQuery += ` (${userId}, "${favorCategory}"),`;
        }
        createQuery = createQuery.slice(0, createQuery.length - 1) + ";";

        const createResult = await conn.query<ResultSetHeader>(createQuery);

        const [resultSetHeader] = createResult;
        const { affectedRows, insertId } = resultSetHeader;
        if (affectedRows !== disfavorCategoryList.length)
            throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.", "DATABASE_UNKOWN_QUERY");

        return { insertId, affectedRows };
    };

    // Delete

    public deleteAllFavorCateogryList = async (conn: PoolConnection, userId: number): Promise<void> => {
        const deleteQuery = `DELETE FROM user_favor_category_list WHERE user_id = ?;`;
        await conn.query<ResultSetHeader>(deleteQuery, [userId]);
    };
    public deleteAllDisfavorCateogryList = async (conn: PoolConnection, userId: number): Promise<void> => {
        const deleteQuery = `DELETE FROM user_disfavor_category_list WHERE user_id = ?;`;
        await conn.query<ResultSetHeader>(deleteQuery, [userId]);
    };
}
