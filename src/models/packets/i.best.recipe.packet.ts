import { RowDataPacket } from "mysql2/promise";

export interface IBestRecipePacket extends RowDataPacket {
    recipeId: number;
    title: string;
    content: string;
    isIced: number;
    cupSize: string;
    createdAt: string;
    updatedAt: string;
    nickname: string;
    imageUrl: string | null;
    resizedUrl: string | null;
    isLiked: boolean;
    categoryName: string;
}
