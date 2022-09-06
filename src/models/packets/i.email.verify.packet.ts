import { RowDataPacket } from "mysql2/promise";

export interface IUserVerifyListPacket extends RowDataPacket {
    userVerifyListId: number;

    email: string;
    emailVerifiedDate: string;
    emailVerifiedToken: string;
    emailVerifiedCode: string;
    isVerifiedEmail: boolean;

    nickname: string;
    nicknameVerifiedDate: string;
    nicknameVerifiedToken: string;
    isVerifiedNickname: boolean;
}
