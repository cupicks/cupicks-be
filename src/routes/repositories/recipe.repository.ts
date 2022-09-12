import { CreateRecipeDto, IngredientDto, IRecipePacket, UnkownError, UpdateRecipeDto } from "../../models/_.loader";
import { PoolConnection, ResultSetHeader, FieldPacket, RowDataPacket } from "mysql2/promise";
import { IRecipeResponseCustom } from "../../constants/_.loader";

export class RecipeRepository {
    public isAuthenticated = async (conn: PoolConnection, recipeId: number, userId: number): Promise<any> => {
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

        const [result] = await conn.query(query, [recipeId, userId]);

        return result;
    };

    public findRecipeById = async (
        conn: PoolConnection,
        recipeId: number,
    ): Promise<IRecipeResponseCustom | ResultSetHeader> => {
        const query = `
            SELECT *
            FROM recipe
            WHERE recipe_id = ?
        `;

        const [result] = await conn.query<ResultSetHeader>(query, recipeId);

        return result;
    };

    public existLikeRecipeById = async (
        conn: PoolConnection,
        userId: number,
        recipeId: number,
    ): Promise<IRecipeResponseCustom | ResultSetHeader> => {
        const query = `
            SELECT *
            FROM user_like_recipe
            WHERE user_id = ? AND recipe_id = ?;
        `;

        const [result] = await conn.query<ResultSetHeader>(query, [userId, recipeId]);

        return result;
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

    public getRecipe = async (conn: PoolConnection, recipeId: number): Promise<any> => {
        const query = `
        SELECT 
            R.recipe_id AS "recipeId", R.title, R.content, R.is_iced AS "isIced", R.cup_size AS "cupSize", R.created_at AS "createdAt", R.updated_at AS "updatedAt",
            I.ingredient_name AS "ingredientName", I.ingredient_color AS "ingredientColor", I.ingredient_amount AS "ingredientAmount"
        FROM 
            (
                SELECT *
                FROM recipe R
            ) R
        RIGHT JOIN
            (
                SELECT *
                FROM recipe_ingredient I
            ) I
        ON R.recipe_id = I.recipe_id
        WHERE R.recipe_id = ?
        `;

        const [result] = await conn.query<ResultSetHeader>(query, recipeId);

        return result;
    };

    public getRecipes = async (conn: PoolConnection, page: number, count: number): Promise<IRecipePacket[]> => {
        const selectQuery = `SELECT
            recipe_id as recipeId,
            cup_size as cupSize,
            title as title,
            content as content,
            is_iced as isIced,
            is_public as isPublic,
            created_at as createdAt,
            updated_at as updatedAt
        FROM recipe LIMIT ${page - 1}, ${count};`;
        const selectResult = await conn.query<IRecipePacket[]>(selectQuery);
        const [recipePackets, _] = selectResult;

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
}
