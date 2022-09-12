import { RowDataPacket } from "mysql2/promise";

export interface IRecipePacket extends RowDataPacket {
    recipeId: number;
    cupSize: string;
    title: string;
    content: string;

    isIced: 0 | 1;

    createdAt: string;
    updatedAt: string;
    ingredientName: string;
    ingredientColor: string;
    ingredientAmount: string;
    isPublic: 0 | 1;
}
