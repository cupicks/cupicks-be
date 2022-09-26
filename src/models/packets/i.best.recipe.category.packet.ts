import { RowDataPacket } from "mysql2/promise";

export interface IBestRecipeCategoryPacket extends RowDataPacket {
    categoryName: string;
}
