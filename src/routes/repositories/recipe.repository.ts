import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";

import {
    CreateRecipeDto,
    IngredientDto,
    IRecipeCombinedPacket,
    IBestRecipeCommentPacket,
    IRecipePacket,
    IRecipeLikePacket,
    UnkownError,
    UpdateRecipeDto,
    GetRecipeDto,
    DeleteRecipeDto,
} from "../../models/_.loader";

export class RecipeRepository {
    // IsExists

    public isAuthenticatedByUserId = async (
        conn: PoolConnection,
        recipeId: number,
        userId: number,
    ): Promise<boolean> => {
        const query = `
            SELECT 
                *
            FROM
                (
                SELECT recipe.recipe_id
                FROM recipe
                ) recipe
            LEFT JOIN 
                (
                SELECT user_recipe.recipe_id, user_recipe.user_id
                FROM user_recipe
                ) user_recipe
            ON recipe.recipe_id = user_recipe.recipe_id AND recipe.recipe_id = ?
            WHERE user_recipe.user_id = ?
        `;

        const [selectResult] = await conn.query<RowDataPacket[]>(query, [recipeId, userId]);
        const [recipePackets] = selectResult;

        return recipePackets ? true : false;
    };

    public existLikeRecipeById = async (conn: PoolConnection, userId: number, recipeId: number): Promise<boolean> => {
        const query = `
            SELECT *
            FROM user_like_recipe
            WHERE user_id = ? AND recipe_id = ?;
        `;

        const selectResult = await conn.query<RowDataPacket[]>(query, [userId, recipeId]);
        const [recipePackets] = selectResult;

        return recipePackets.length !== 0 ? true : false;
    };

    public userLikeRecipeExist = async (conn: PoolConnection, userId: number, recipeId: number) => {
        const query = `
            SELECT *
            FROM user_like_recipe
            WHERE user_id = ? AND recipe_id = ?
        `;

        const selectResult = await conn.query<RowDataPacket[]>(query, [userId, recipeId]);
        const [recipePackets] = selectResult;

        return recipePackets.length !== 0 ? true : false;
    };

    // Find

    public findRecipeById = async (conn: PoolConnection, recipeId: number): Promise<boolean> => {
        const query = `
            SELECT *
            FROM recipe
            WHERE recipe_id = ?
        `;

        const selectResult = await conn.query<RowDataPacket[]>(query, recipeId);
        const [recipePackets] = selectResult;

        return recipePackets.length !== 0 ? true : false;
    };

    // Get

    public getRecipe = async (conn: PoolConnection, recipeId: number): Promise<IRecipeCombinedPacket> => {
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
            user.user_id as userId,
            user.nickname as nickname,
            user.image_url as imageUrl,
            user.resized_url as resizedUrl,
            count(user_like_recipe.user_id) as likeTotal
        FROM (
            SELECT
                recipe_id, cup_size, title, content, is_iced, is_public, created_at, updated_at
            FROM recipe
            WHERE recipe_id = ${recipeId}
            LIMIT 1
        ) recipe
        LEFT OUTER JOIN user_recipe
            ON recipe.recipe_id = user_recipe.recipe_id
        LEFT OUTER JOIN user
            ON user_recipe.user_id = user.user_id
        LEFT OUTER JOIN user_like_recipe
            ON user_like_recipe.recipe_id = recipe.recipe_id
            GROUP BY user_like_recipe.recipe_id;`;
        const selectResult = await conn.query<IRecipeCombinedPacket[]>(selectQuery);
        const [recipePackets] = selectResult;

        return recipePackets[0];
    };
    public getRecipeLegacy = async (conn: PoolConnection, recipeId: number): Promise<IRecipeCombinedPacket[]> => {
        const query = `
        SELECT
            recipe.recipe_id AS "recipeId", recipe.title, recipe.content, recipe.is_iced AS "isIced", recipe.cup_size AS "cupSize", recipe.created_at AS "createdAt", recipe.updated_at AS "updatedAt",
            recipe_ingredient.ingredient_name AS "ingredientName", recipe_ingredient.ingredient_color AS "ingredientColor", recipe_ingredient.ingredient_amount AS "ingredientAmount",
            recipe.nickname, recipe.image_url AS 'imageUrl', recipe.resized_url AS 'resizedUrl'
        FROM 
            (
                SELECT 
                    recipe.*,
                    user.nickname,
                    user.image_url,
                    user.resized_url
                FROM (
                    SELECT user_id, recipe_id
                    FROM user_recipe
                    WHERE recipe_id = ?
                ) user_recipe
                LEFT OUTER JOIN user
                ON user_recipe.user_id = user.user_id

                LEFT OUTER JOIN recipe
                ON user_recipe.recipe_id = recipe.recipe_id
            ) recipe
        LEFT OUTER JOIN
            (
                SELECT *
                FROM recipe_ingredient
                WHERE recipe_id = ?
                ORDER BY recipe_ingredient_id asc
            ) recipe_ingredient
        ON recipe.recipe_id = recipe_ingredient.recipe_id
        `;

        const [result] = await conn.query<IRecipeCombinedPacket[]>(query, [recipeId, recipeId]);

        return result;
    };

    public getRecipes = async (conn: PoolConnection, getRecipeDto: GetRecipeDto): Promise<IRecipeCombinedPacket[]> => {
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
            LIMIT ${getRecipeDto.count} OFFSET ${(getRecipeDto.page - 1) * getRecipeDto.count}
        ) recipe
        LEFT OUTER JOIN user_recipe
            ON recipe.recipe_id = user_recipe.recipe_id
        LEFT OUTER JOIN user
            ON user_recipe.user_id = user.user_id;`;

        const selectResult = await conn.query<IRecipeCombinedPacket[]>(selectQuery);
        const [recipePackets] = selectResult;

        return recipePackets;
    };

    public getRecipeComment = async (conn: PoolConnection, recipeId: number): Promise<IBestRecipeCommentPacket[]> => {
        const query = `
            SELECT user_id, count(*)
            FROM recipe_comment
            WHERE recipe_comment.recipe_id = ?
            GROUP BY recipe_comment.comment_id ORDER BY count(*)`;

        const selectResult = await conn.query<IBestRecipeCommentPacket[]>(query, [recipeId]);
        const [recipePackets] = selectResult;

        return recipePackets;
    };

    public getRecipeLike = async (conn: PoolConnection, recipeId: number): Promise<IRecipeLikePacket[]> => {
        const query = `
            SELECT count(*) as likeTotal
            FROM user_like_recipe
            WHERE user_like_recipe.recipe_id = ?
            GROUP BY user_like_recipe.user_id ORDER BY count(*)
        `;

        const selectResult = await conn.query<IRecipeLikePacket[]>(query, [recipeId]);
        const [recipePackets] = selectResult;

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

    public getMyRecipeByUserId = async (
        conn: PoolConnection,
        userId: number,
        page: number,
        pageCount: number,
    ): Promise<IRecipePacket[]> => {
        const selectQuery = `SELECT
            user_recipe_list.recipe_id as recipeId,
            user_recipe_list.title,
            user_recipe_list.content,
            user_recipe_list.is_iced as isIced,
            user_recipe_list.cup_size as cupSize,
            user_recipe_list.created_at as createdAt,
            user_recipe_list.updated_at as updatedAt,
            IF (user_like_recipe.user_id IS NULL, 0, 1) as isLiked
        FROM (
            SELECT
                recipe.title as title,
                recipe.content as content,
                recipe.is_iced as is_iced,
                recipe.cup_size as cup_size,
                recipe.created_at as created_at,
                recipe.updated_at as updated_at,
                user_recipe.recipe_id as recipe_id,
                user_recipe.user_id as user_id
            FROM (
                SELECT
                    user_id,
                    recipe_id
                FROM user_recipe
                WHERE user_id = ?
                ORDER BY recipe_id desc
                LIMIT ? OFFSET ?
            ) as user_recipe LEFT OUTER JOIN recipe
            ON user_recipe.recipe_id = recipe.recipe_id
        ) as user_recipe_list LEFT OUTER JOIN (
            SELECT *
            FROM user_like_recipe
            WHERE user_like_recipe.user_id = ?
        ) as user_like_recipe
        ON user_recipe_list.recipe_id = user_like_recipe.recipe_id;`;
        const selectResult = await conn.query<IRecipePacket[]>(selectQuery, [
            userId,
            pageCount,
            (page - 1) * pageCount,
            userId,
        ]);

        const [iRecipePacket] = selectResult;

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
            recipe.title as title,
            recipe.content as content,
            recipe.is_iced as isIced,
            recipe.cup_size as cupSize,
            recipe.created_at as createdAt,
            recipe.updated_at as updatedAt,
            1 as isLiked,
            user.nickname as nickname,
            user.image_url as imageUrl,
            user.resized_url as resizedUrl
        FROM (
            SELECT recipe_id FROM user_like_recipe
            WHERE user_id = ?
            ORDER BY recipe_id desc
            LIMIT ? OFFSET ?
        ) as user_like_recipe

        LEFT OUTER JOIN recipe
        ON user_like_recipe.recipe_id = recipe.recipe_id
        
        LEFT OUTER JOIN user_recipe
        ON recipe.recipe_id = user_recipe.recipe_id
        
        LEFT OUTER JOIN user
        ON user_recipe.user_id = user.user_id;`;

        const selectResult = await conn.query<IRecipePacket[]>(selectQuery, [
            userId,
            pageCount,
            (page - 1) * pageCount,
        ]);

        const [iRecipePacket] = selectResult;

        return iRecipePacket;
    };

    public getMyLikeRecipeIds = async (conn: PoolConnection, userId: number | null): Promise<IRecipeLikePacket[]> => {
        const selectQuery = `
            SELECT user_like_recipe.recipe_id as recipeId
            FROM (
                SELECT user.user_id
                FROM user
            ) user
            JOIN user_like_recipe
            ON user.user_id = user_like_recipe.user_id
            WHERE user.user_id = ?;
        `;

        const selectResult = await conn.query<IRecipeLikePacket[]>(selectQuery, [userId]);

        const [recipePackets] = selectResult;

        return recipePackets;
    };

    public getRecipeCategory = async (conn: PoolConnection, category: string) => {
        const selectQuery = `
            SELECT * 
            FROM recipe_category
            WHERE name = ?
        `;

        const selectResult = await conn.query<RowDataPacket[]>(selectQuery, [category]);

        const [categoryPacket] = selectResult;

        return categoryPacket;
    };

    // Create

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

        if (affectedRows > 1) throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.", "DATABASE_UNKOWN_QUERY");

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

            if (total > 20) throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.", "DATABASE_UNKOWN_QUERY");
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
        const [resultSetHeader] = createResult;

        if (resultSetHeader.affectedRows !== ingredientList.length)
            throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.", "DATABASE_UNKOWN_QUERY");

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

        if (affectedRows > 1) throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.", "DATABASE_UNKOWN_QUERY");

        return JSON.stringify(result[0].insertId);
    };

    public createRecipeIngredientList = async (
        conn: PoolConnection,
        recipeId: number,
        ingredientIdList: number[],
    ): Promise<number> => {
        const ingredientString = ingredientIdList.join(",").toString();

        const query = `INSERT INTO recipe_ingredient_list
                (recipe_id, recipe_ingredient_list)
            VALUES (${recipeId}, "${ingredientString}");`;

        const result = await conn.query<ResultSetHeader>(query);

        const resultSetHeader = result[0];
        const { affectedRows, insertId } = resultSetHeader;

        if (affectedRows > 1) throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.", "DATABASE_UNKOWN_QUERY");

        return insertId;
    };

    public createRecipeCategory = async (conn: PoolConnection, category: string): Promise<number> => {
        const query = `INSERT INTO recipe_category
                (name)
            VALUES (?);        
        `;

        const insertResult = await conn.query<ResultSetHeader>(query, [category]);

        const insertRSetHeader = insertResult[0];
        const { affectedRows, insertId } = insertRSetHeader;

        if (affectedRows > 1) throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.", "DATABASE_UNKOWN_QUERY");

        return insertId;
    };

    public createRecipeCategoryList = async (
        conn: PoolConnection,
        category: string,
        recipeId: number,
    ): Promise<number> => {
        const query = `INSERT INTO recipe_category_list
                (recipe_id, category_name)
            VALUES (?, ?);
        `;

        const insertResult = await conn.query<ResultSetHeader>(query, [recipeId, category]);

        const insertSetHeader = insertResult[0];
        const { affectedRows, insertId } = insertSetHeader;

        if (affectedRows > 1) throw new UnkownError("부적절한 쿼리문이 실행된 것 같습니다.", "DATABASE_UNKOWN_QUERY");

        return insertId;
    };

    // Update

    public updateRecipeById = async (conn: PoolConnection, updateRecipeDto: UpdateRecipeDto): Promise<object> => {
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
            updateRecipeDto.recipeId,
        ]);

        return result;
    };

    // public updateRecipeCategoryListById = async (conn: PoolConnection)

    // Delete

    public deleteRecipeById = async (conn: PoolConnection, recipeId: number): Promise<object> => {
        const deleteQuery = `
            DELETE FROM recipe
            WHERE recipe_id = ?;
        `;

        const [result] = await conn.query<ResultSetHeader>(deleteQuery, recipeId);

        return result;
    };

    public deleteRecipeIngredientById = async (conn: PoolConnection, recipeId: number): Promise<object> => {
        const deleteQuery = `
            DELETE FROM recipe_ingredient
            WHERE recipe_id = ?;
        `;

        const [result] = await conn.query<ResultSetHeader>(deleteQuery, recipeId);

        return result;
    };

    public deleteRecipeCategoryListById = async (conn: PoolConnection, recipeId: number): Promise<object> => {
        const deleteQuery = `
            DELETE FROM recipe_category_list
            WHERE recipe_id = ?;
        `;

        const [result] = await conn.query<ResultSetHeader>(deleteQuery, recipeId);

        return result;
    };

    // Special

    public likeRecipe = async (conn: PoolConnection, likeRecipeDto?: DeleteRecipeDto): Promise<boolean> => {
        const query = `
            INSERT INTO user_like_recipe
                (user_id, recipe_id)
            VALUES
                (?, ?);
        `;

        const [result] = await conn.query<ResultSetHeader>(query, [likeRecipeDto.userId, likeRecipeDto.recipeId]);

        return true;
    };

    public disLikeRecipe = async (conn: PoolConnection, dislikeRecipeDto: DeleteRecipeDto): Promise<boolean> => {
        const query = `
            DELETE FROM user_like_recipe
            WHERE user_id = ? AND recipe_id = ?
        `;

        const [result] = await conn.query<ResultSetHeader>(query, [dislikeRecipeDto.userId, dislikeRecipeDto.recipeId]);

        return true;
    };
}
