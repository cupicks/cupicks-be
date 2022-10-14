import { IRecipeIngredientPacket } from "../../models/_.loader";
import { PoolConnection } from "mysql2/promise";

export class RecipeIngredientRepository {
    public getRecipeIngredientsByRecipeid = async (
        conn: PoolConnection,
        recipeId: number,
    ): Promise<IRecipeIngredientPacket[]> => {
        const selectQuery = `SELECT
            recipe_ingredient_id as recipeIngredientId,
            recipe_id as recipeId,
            ingredient_name as ingredientName,
            ingredient_color as ingredientColor,
            ingredient_amount as ingredientAmount
        FROM recipe_ingredient WHERE recipe_id = ${recipeId};`;
        const selectResult = await conn.query<IRecipeIngredientPacket[]>(selectQuery);

        return selectResult[0];
    };

    public getRecipeIngredientsByRecipeidList = async (
        conn: PoolConnection,
        recipeIdList: number[],
    ): Promise<IRecipeIngredientPacket[]> => {
        const recipeIdListString = recipeIdList.join(",");
        const selectQuery = `SELECT
            recipe_ingredient_id as recipeIngredientId,
            recipe_id as recipeId,
            ingredient_name as ingredientName,
            ingredient_color as ingredientColor,
            ingredient_amount as ingredientAmount
        FROM recipe_ingredient WHERE recipe_id IN (${recipeIdListString});`;
        const selectResult = await conn.query<IRecipeIngredientPacket[]>(selectQuery);

        return selectResult[0];
    };
}
