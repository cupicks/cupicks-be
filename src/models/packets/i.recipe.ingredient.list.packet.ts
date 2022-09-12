import { RowDataPacket } from "mysql2/promise";

export interface IRecipeIngredientListPacket extends RowDataPacket {
    recipeId: number;
    recipeIngredientList: string;
}
