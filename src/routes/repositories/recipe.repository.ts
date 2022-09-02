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

        console.log(result[0]);

        return insertId;
    };

    public createRecipeIngredient = async (conn: any, ingredientList: any): Promise<number> => {
        const query = `
            INSERT INTO recipe_ingredient SET ?
        `;

        for (let i = 0; i < ingredientList.length; i++) {
            await conn.query(query, ingredientList[i]);
        }

        return ingredientList[0].recipe_id;
    };
}
