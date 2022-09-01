import { RowDataPacket } from "mysql2/promise";

export interface IUserPacket extends RowDataPacket {
    userId: number;
    email: string;
    nickname: string;
    password: string;
    imageUrl?: string;
}
