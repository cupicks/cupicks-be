import { CreateRecipeDto } from "../../models/_.loader";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";

export class RecipeRepository {
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

    public createRecipeIngredient = async (conn: PoolConnection, ingredientList: any): Promise<number> => {
        const query = `
            INSERT INTO recipe_ingredient SET ?
        `;

        let total: number = 0;

        for (let i = 0; i < ingredientList.length; i++) {
            const result = await conn.query<ResultSetHeader>(query, ingredientList[i]);

            const resultSetHeader = result[0];
            const { affectedRows } = resultSetHeader;
            total += affectedRows;

            if (total > 20) throw new Error("protected");
        }

        return ingredientList[0].recipe_id;
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
}
