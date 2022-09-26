import { RowDataPacket } from "mysql2/promise";

export interface IWeeklyBestPacket extends RowDataPacket {
    totalLike: number;
    recipeId: number;
    createdAt: string;
}
