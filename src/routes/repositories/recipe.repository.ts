import {
    CreateRecipeDto,
    IngredientDto,
    IRecipeCombinedPacket,
    IRecipePacket,
    UnkownError,
    UpdateRecipeDto,
} from "../../models/_.loader";
import { PoolConnection, ResultSetHeader, FieldPacket, RowDataPacket } from "mysql2/promise";
import { IRecipeResponseCustom } from "../../constants/_.loader";

export class RecipeRepository {
    public isAuthenticated = async (conn: PoolConnection, recipeId: number, userId: number): Promise<boolean> => {
        const query = `
            SELECT 
                *
            FROM
                (
                SELECT R.recipe_id
                FROM recipe R
                ) R
            LEFT JOIN 
                (
                SELECT U.recipe_id, U.user_id
                FROM user_recipe U
                ) U
            ON R.recipe_id = U.recipe_id AND R.recipe_id = ?
            WHERE U.user_id = ?
        `;

        const [selectResult] = await conn.query<RowDataPacket[]>(query, [recipeId, userId]);
        const [recipePackets, _] = selectResult;

        return recipePackets ? true : false;
    };

    public findRecipeById = async (conn: PoolConnection, recipeId: number): Promise<boolean> => {
        const query = `
            SELECT *
            FROM recipe
            WHERE recipe_id = ?
        `;

        const selectResult = await conn.query<RowDataPacket[]>(query, recipeId);
        const [recipePackets, _] = selectResult;

        return recipePackets.length !== 0 ? true : false;
    };

    public existLikeRecipeById = async (conn: PoolConnection, userId: number, recipeId: number): Promise<boolean> => {
        const query = `
            SELECT *
            FROM user_like_recipe
            WHERE user_id = ? AND recipe_id = ?;
        `;

        const selectResult = await conn.query<RowDataPacket[]>(query, [userId, recipeId]);
        const [recipePackets, _] = selectResult;

        return recipePackets.length !== 0 ? true : false;
    };

    public createRecipe = async (conn: PoolConnection, recipeDto: CreateRecipeDto): Promise<number> => {
        const query = `
            INSERT INTO recipe
                (cup_size, title, content, is_iced, is_public)
            VALUES
                ("${recipeDto.cupSize}", "${recipeDto.title}", "${recipeDto.content}", ${recipeDto.isIced}, ${recipeDto.isPublic});
        `;

        const result = await conn.query<ResultSetHeader>(query);
        const resultSetHeader = result[0];
        const { affectedRows, insertId } = resultSetHeader;

        if (affectedRows > 1) throw new UnkownError("부적절한 쿼리문이 실행 된 것 같습니다.");

        return insertId;
    };

    /** @deprecated */
    public createRecipeIngredientLegacy = async (
        conn: PoolConnection,
        ingredientList: Array<object>,
    ): Promise<number[]> => {
        const query = `
            INSERT INTO recipe_ingredient SET ?
        `;

        let total = 0;
        const insertIdList: number[] = [];

        for (let i = 0; i < ingredientList.length; i++) {
            const result = await conn.query<ResultSetHeader>(query, ingredientList[i]);

            const resultSetHeader = result[0];
            const { affectedRows, insertId } = resultSetHeader;

            total += affectedRows;
            insertIdList.push(insertId);

            if (total > 20) throw new UnkownError("부적절한 쿼리문이 실행 된 것 같습니다.");
        }

        return insertIdList;
    };

    public createRecipeIngredients = async (
        conn: PoolConnection,
        recipeId: number,
        ingredientList: IngredientDto[],
    ): Promise<number[]> => {
        let tmpCreateQuery = `INSERT INTO recipe_ingredient (recipe_id, ingredient_name, ingredient_color, ingredient_amount) VALUES`;

        for (const ingre of ingredientList) {
            const ingreRowQuery = `(${recipeId}, "${ingre.ingredientName}", "${ingre.ingredientColor}", "${ingre.ingredientAmount}"), `;
            tmpCreateQuery += ingreRowQuery;
        }

        const createQuery = tmpCreateQuery.substring(0, tmpCreateQuery.length - 2) + ";";

        const createResult = await conn.query<ResultSetHeader>(createQuery);
        const [resultSetHeader, _] = createResult;

        if (resultSetHeader.affectedRows !== ingredientList.length)
            throw new UnkownError("부적절한 쿼리문이 실행 된 것 같습니다.");

        const insertedIdList = new Array(resultSetHeader.affectedRows)
            .fill(resultSetHeader.insertId)
            .map((insertedId, idx) => insertedId + idx);

        return insertedIdList;
    };

    public createUserRecipe = async (conn: PoolConnection, userId: number, recipeId: number): Promise<string> => {
        const query = `
            INSERT INTO user_recipe
                (user_id, recipe_id)
            VALUES
                (?, ?);
        `;

        const result = await conn.query<ResultSetHeader>(query, [userId, recipeId]);

        const resultSetHeader = result[0];
        const { affectedRows } = resultSetHeader;

        if (affectedRows > 1) throw new UnkownError("부적절한 쿼리문이 실행 된 것 같습니다.");

        return JSON.stringify(result[0].insertId);
    };

    public createRecipeIngredientList = async (conn: PoolConnection, recipeId: number, ingredientIdList: number[]) => {
        const ingredientString = ingredientIdList.join(",").toString();

        const query = `INSERT INTO recipe_ingredient_list
                (recipe_id, recipe_ingredient_list)
            VALUES (${recipeId}, "${ingredientString}");`;

        const result = await conn.query<ResultSetHeader>(query);

        const resultSetHeader = result[0];
        const { affectedRows, insertId } = resultSetHeader;

        if (affectedRows > 1) throw new UnkownError("부적절한 쿼리문이 실행 된 것 같습니다.");

        return insertId;
    };

    public getRecipe = async (conn: PoolConnection, recipeId: number): Promise<IRecipeCombinedPacket[]> => {
        const query = `
        SELECT
            R.recipe_id AS "recipeId", R.title, R.content, R.is_iced AS "isIced", R.cup_size AS "cupSize", R.created_at AS "createdAt", R.updated_at AS "updatedAt",
            I.ingredient_name AS "ingredientName", I.ingredient_color AS "ingredientColor", I.ingredient_amount AS "ingredientAmount",
            R.nickname, R.image_url as 'imageUrl', R.resized_url as 'resizedUrl'
        FROM 
            (
                SELECT 
                    recipe.*,
                    user.nickname,
                    user.image_url,
                    user.resized_url
                FROM (
                    SELECT user_id, recipe_id FROM user_recipe WHERE recipe_id = ?
                ) user_recipe
                LEFT OUTER JOIN user
                ON user_recipe.user_id = user.user_id
                LEFT OUTER JOIN recipe
                ON user_recipe.recipe_id = recipe.recipe_id
            ) R
        LEFT OUTER JOIN
            (
                SELECT *
                FROM recipe_ingredient I
            ) I
        ON R.recipe_id = I.recipe_id
        `;

        const [result] = await conn.query<IRecipeCombinedPacket[]>(query, recipeId);

        return result;
    };

    public getRecipes = async (conn: PoolConnection, page: number, count: number): Promise<IRecipeCombinedPacket[]> => {
        const selectQuery = `
        SELECT    
            recipe.recipe_id as recipeId,
            recipe.cup_size as cupSize,
            recipe.title as title,
            recipe.content as content,
            recipe.is_iced as isIced,
            recipe.is_public as isPublic,
            recipe.created_at as createdAt,
            recipe.updated_at as updatedAt,
            user.nickname as nickname,
            user.image_url as imageUrl,
            user.resized_url as resizedUrl
        FROM (
            SELECT
                recipe_id, cup_size, title, content, is_iced, is_public, created_at, updated_at
            FROM recipe
            ORDER BY recipe_id desc
            LIMIT ${count} OFFSET ${(page - 1) * count}
        ) recipe
        LEFT OUTER JOIN user_recipe
            ON recipe.recipe_id = user_recipe.recipe_id
        LEFT OUTER JOIN user
            ON user_recipe.user_id = user.user_id;`;
        const selectResult = await conn.query<IRecipeCombinedPacket[]>(selectQuery);
        const [recipePackets, _] = selectResult;

        console.log(recipePackets);

        return recipePackets;
    };

    /** @deprecated */
    public getRecipesLegacy = async (conn: PoolConnection, page: number, count: number): Promise<any> => {
        const query = `
        SELECT
            R.recipe_id AS recipeId, R.title, R.content,
            RIL.recipe_ingredient_list AS ingredientList
        FROM recipe R
        JOIN recipe_ingredient_list RIL
        ON R.recipe_id = RIL.recipe_id
        `;

        const [result] = await conn.query(query, [page, count]);

        return result;
    };

    public deleteRecipe = async (conn: PoolConnection, recipeId: number): Promise<object> => {
        const query = `
            DELETE FROM recipe
            WHERE recipe_id = ?;
        `;

        const [result] = await conn.query(query, recipeId);

        return result;
    };

    public deleteRecipeIngredient = async (conn: PoolConnection, recipeId: number) => {
        const query = `
            DELETE FROM recipe_ingredient
            WHERE recipe_id = ?;
        `;

        const [result] = await conn.query(query, recipeId);

        return result;
    };

    public updateRecipe = async (
        conn: PoolConnection,
        updateRecipeDto: UpdateRecipeDto,
        recipeId: number,
    ): Promise<object> => {
        const query = `
            UPDATE recipe
            SET
                title = ?, content = ?, is_iced = ?, is_public = ?
            WHERE recipe_id = ?
        `;

        const [result] = await conn.query(query, [
            updateRecipeDto.title,
            updateRecipeDto.content,
            updateRecipeDto.isIced,
            updateRecipeDto.isPublic,
            recipeId,
        ]);

        return result;
    };

    public likeRecipe = async (conn: PoolConnection, userId: number, recipeId: number): Promise<boolean> => {
        const query = `
            INSERT INTO user_like_recipe
                (user_id, recipe_id)
            VALUES
                (?, ?);
        `;

        const [result] = await conn.query<ResultSetHeader>(query, [userId, recipeId]);

        return true;
    };

    public disRecipe = async (conn: PoolConnection, userId: number, recipeId: number): Promise<boolean> => {
        const query = `
            DELETE FROM user_like_recipe
            WHERE user_id = ? AND recipe_id = ?
        `;

        const [result] = await conn.query<ResultSetHeader>(query, [userId, recipeId]);

        return true;
    };

    public getMyRecipeByUserid = async (
        conn: PoolConnection,
        userId: number,
        page: number,
        pageCount: number,
    ): Promise<IRecipePacket[]> => {
        const selectQuery = `SELECT
                recipe.recipe_id as recipeId,
                title,
                content,
                is_iced as isIced,
                cup_size as cupSize,
                created_at as createdAt,
                updated_at as updatedAt
            FROM (
                SELECT recipe_id FROM user_recipe
                WHERE user_id = ?
                ORDER BY recipe_id desc
                LIMIT ? OFFSET ?
            ) user_recipe LEFT OUTER JOIN recipe
            ON user_recipe.recipe_id = recipe.recipe_id;`;
        const selectResult = await conn.query<IRecipePacket[]>(selectQuery, [
            userId,
            pageCount,
            (page - 1) * pageCount,
        ]);

        const [iRecipePacket, _] = selectResult;

        return iRecipePacket;
    };

    public getLikeRecipeByUserid = async (
        conn: PoolConnection,
        userId: number,
        page: number,
        pageCount: number,
    ): Promise<IRecipePacket[]> => {
        const selectQuery = `SELECT
                recipe.recipe_id as recipeId,
                title,
                content,
                is_iced as isIced,
                cup_size as cupSize,
                created_at as createdAt,
                updated_at as updatedAt
            FROM (
                SELECT recipe_id FROM user_like_recipe
                WHERE user_id = ?
                ORDER BY recipe_id desc
                LIMIT ? OFFSET ?
            ) user_like_recipe LEFT OUTER JOIN recipe
            ON user_like_recipe.recipe_id = recipe.recipe_id;`;
        const selectResult = await conn.query<IRecipePacket[]>(selectQuery, [
            userId,
            pageCount,
            (page - 1) * pageCount,
        ]);

        const [iRecipePacket, _] = selectResult;

        return iRecipePacket;
    };
}
