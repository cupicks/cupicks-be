import { CreateRecipeDto, UpdateRecipeDto } from "../../models/_.loader";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";

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

        if (affectedRows > 1) throw new Error("protected");

        return insertId;
    };

    public createRecipeIngredient = async (conn: PoolConnection, ingredientList: Array<object>) => {
        const query = `
            INSERT INTO recipe_ingredient SET ?
        `;

        let total = 0;

        for (let i = 0; i < ingredientList.length; i++) {
            const result = await conn.query<ResultSetHeader>(query, ingredientList[i]);

            const resultSetHeader = result[0];
            const { affectedRows } = resultSetHeader;

            total += affectedRows;

            if (total > 20) throw new Error("protected");
        }
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

        if (affectedRows > 1) throw new Error("protected");

        return JSON.stringify(result[0].insertId);
    };

    public getRecipes = async (conn: PoolConnection, page?: number, count?: number): Promise<any> => {
        const query = `
            SELECT 
                R.recipe_id, R.title, R.content,
                I.ingredient_name, I.ingredient_color, I.ingredient_amount
            FROM
                (
                SELECT R.recipe_id, R.title, R.content, R.cup_size, R.is_iced, R.is_public, R.created_at, R.updated_at
                FROM recipe R
                ) R
            RIGHT JOIN
                (
                SELECT I.recipe_id, I.ingredient_name, I.ingredient_color, I.ingredient_amount
                FROM recipe_ingredient I
                ) I
            ON R.recipe_id = I.recipe_id; 
        `;

        const [result] = await conn.query(query);

        return result;
    };

    public deleteRecipe = async (conn: PoolConnection, recipeId: number): Promise<any> => {
        const query = `
            DELETE FROM recipe
            WHERE recipe_id = ?;
        `;

        const [result] = await conn.query(query, recipeId);

        return result;
    };

    public updateRecipe = async (
        conn: PoolConnection,
        updateRecipeDto: UpdateRecipeDto,
        recipeId: number,
        userId: number,
    ): Promise<any> => {
        const query = `
            
        `;
    };
}
