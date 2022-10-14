import { RowDataPacket } from "mysql2/promise";

export interface IRecipeLikePacket extends RowDataPacket {
    recipeId?: number;
    likeTotal?: number;
}
