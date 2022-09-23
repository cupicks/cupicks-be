import { RowDataPacket } from "mysql2/promise";

export interface IRecipePacket extends RowDataPacket {
    recipeId: number;
    title: string;
    content: string;

    isIced: 0 | 1;
    isLiked: 0 | 1;
    cupSize: string;

    createdAt: string;
    updatedAt: string;
}
