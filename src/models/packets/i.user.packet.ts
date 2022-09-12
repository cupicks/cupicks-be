import { RowDataPacket } from "mysql2/promise";

export interface IUserPacket extends RowDataPacket {
    userId: number;
    email: string;
    nickname: string;
    password: string;
    imageUrl?: string;

    resetPasswordToken: string;
    resetPasswordDate: string;
    currentPasswordSentCount: number;
    passwordSentExceedingDate: string | null;
    isExeededOfPasswordSent: 0 | 1;
}

export interface IUserRefresthTokenPacket extends RowDataPacket {
    userId: number;
    refreshToken?: string;
}
