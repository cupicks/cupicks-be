import { CreateRecipeDto } from "../../models/_.loader";
import { PoolConnection } from "mysql2/promise";

export class RecipeRepository {
    public createRecipe = async (conn: any, recipeDto: CreateRecipeDto): Promise<any> => {
        const query = `
            INSERT INTO recipe
                (cup_size, title, content, is_iced, is_public)
            VALUES
                ("${recipeDto.cupSize}", "${recipeDto.title}", "${recipeDto.content}", ${recipeDto.isIced}, ${recipeDto.isPublic});
        `;
        const result = await conn.query(query, recipeDto);
        return result;
    };

    public createRecipeIngredient = async (
        conn: any,
        recipeId: number,
        ingredientName: string,
        ingredientColor: string,
        ingredientAmount: number,
    ): Promise<void> => {
        const query = `
            INSERT INTO recipe_ingredient
                (recipe_id, ingredient_name, ingredient_color, ingredient_amount)
            VALUES
                (${recipeId}, "${ingredientName}", "${ingredientColor}", ${ingredientAmount});
        `;
        const result = await conn.query(query);
    };
}
