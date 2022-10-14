import { PoolConnection, ResultSetHeader } from "mysql2/promise";

import { UnkownError } from "../../models/_.loader";
import { IWeeklyBestPacket, IBestRecipePacket, IBestRecipeCategoryPacket } from "../../models/_.loader";

export class RankingRepository {
    // Get

    public getWeeklyBestRecipesByLike = async (
        conn: PoolConnection,
        startDate: string,
        endDate: string,
    ): Promise<IWeeklyBestPacket[]> => {
        const query = `
            SELECT 
            count(*) as totalLike, 
            user_like_recipe.recipe_id as recipeId
            FROM user_like_recipe
            LEFT JOIN recipe
            ON recipe.recipe_id = user_like_recipe.recipe_id
            WHERE user_like_recipe.created_at AND recipe.created_at BETWEEN ? AND ?
            GROUP BY user_like_recipe.recipe_id ORDER BY count(*) DESC LIMIT 3;
        `;

        const selectResult = await conn.query<IWeeklyBestPacket[]>(query, [startDate, endDate]);
        const [Packets] = selectResult;

        return Packets;
    };

    public getBestRecipes = async (conn: PoolConnection, recipeId: number): Promise<IBestRecipePacket[]> => {
        const query = `
            SELECT 
                recipe.recipe_id as recipeId,
                recipe.title,
                recipe.content,
                recipe.is_iced as isIced,
                recipe.cup_size as cupSize,
                recipe.created_at as createdAt,
                recipe.updated_at as updatedAt,
                user.nickname,
                user.image_url as imageUrl,
                user.resized_url as resizedUrl
            FROM 
                (
                    SELECT *
                    FROM recipe
                ) recipe
            LEFT JOIN user_recipe
            ON recipe.recipe_id = user_recipe.recipe_id
            LEFT JOIN 
                (
                    SELECT user.user_id, user.nickname, user.image_url, user.resized_url
                    FROM user
                ) user
            ON user_recipe.user_id = user.user_id
            WHERE recipe.recipe_id = ?;
        `;

        const selectResult = await conn.query<IBestRecipePacket[]>(query, [recipeId]);
        const [Packets] = selectResult;

        return Packets;
    };

    public getBestRecipeCategory = async (
        conn: PoolConnection,
        recipeId: number,
    ): Promise<IBestRecipeCategoryPacket[]> => {
        const query = `
            SELECT category_name as categoryName
            FROM recipe_category_list
            WHERE recipe_id = ?
        `;

        const selectResult = await conn.query<IBestRecipeCategoryPacket[]>(query, [recipeId]);
        const [Packets] = selectResult;

        return Packets;
    };

    // Create

    public createBestRecipeRanking = async (
        conn: PoolConnection,
        ranking: number,
        recipeId: number,
        start: string,
        end: string,
        categoryName: string,
    ) => {
        const query = `
            INSERT INTO best_recipe_ranking
                (ranking, recipe_id, start_date, end_date, category)
            VALUES
                (?, ?, ?, ?, ?)
        `;

        const insertResult = await conn.query<ResultSetHeader>(query, [3, recipeId, start, end, categoryName]);
        const resultSetHeader = insertResult[0];
        const { affectedRows, insertId } = resultSetHeader;

        if (affectedRows > 1) throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.", "DATABASE_UNKOWN_QUERY");
    };
}
