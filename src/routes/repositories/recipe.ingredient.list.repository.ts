import { IRecipeIngredientListPacket } from "../../models/_.loader";
import { PoolConnection } from "mysql2/promise";

/** @deprecated */
export class RecipeIngredientListRepository {
    /** @deprecated */
    public getRecipeIngrdientList = async (
        conn: PoolConnection,
        recipeIdList: number[],
    ): Promise<IRecipeIngredientListPacket[]> => {
        const recipeidListString = recipeIdList.join(",");
        const selectQuery = `SELECT
            recipe_id as recipeId,
            recipe_ingredient_list as recipeIngredientList 
        FROM cupick_dev.recipe_ingredient_list
        WHERE recipe_id IN (${recipeidListString});`;

        const selectResult = await conn.query<IRecipeIngredientListPacket[]>(selectQuery);
        const [recipeIngredientListPacket] = selectResult;
        return recipeIngredientListPacket;
    };
}
