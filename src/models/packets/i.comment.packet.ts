import { RowDataPacket } from "mysql2/promise";

export interface ICommentPacket extends RowDataPacket {
    userId?: number | undefined;
    nickname?: string | undefined;
    recipeId?: number;
    commentId?: number;
    comment?: string;
    image_url?: string | null;
    resizedUrl?: string | null;
    createdAt?: string;
    updatedAt?: string;
}
