import { RowDataPacket } from "mysql2/promise";

export interface IRecipeOwnerPacket extends RowDataPacket {
    recipeId: number;
    title: string;
    content: string;

    isIced: 0 | 1;
    isLiked: 0 | 1;
    cupSize: string;

    createdAt: string;
    updatedAt: string;

    nickname: string;
    imageUrl: string;
    resizedUrl: string;
}
