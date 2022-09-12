import { RowDataPacket } from "mysql2/promise";

export interface IRecipeIngredientPacket extends RowDataPacket {
    recipeIngredientId: number;
    recipeId: number;

    ingredientName: string;
    ingredientColor: string;
    ingredientAmount: string;
}
