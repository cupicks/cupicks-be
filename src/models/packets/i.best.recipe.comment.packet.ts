import { RowDataPacket } from "mysql2/promise";

export interface IBestRecipeCommentPacket extends RowDataPacket {
    commentTotal?: number;
}
