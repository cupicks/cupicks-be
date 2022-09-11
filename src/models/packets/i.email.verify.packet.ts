import { RowDataPacket } from "mysql2/promise";

export interface IUserVerifyListPacket extends RowDataPacket {
    userVerifyListId: number;

    email: string;
    emailVerifiedDate: string;
    emailVerifiedToken: string;
    emailVerifiedCode: string;
    isVerifiedEmail: 0 | 1;

    currentEmailSentCount: number;
    emailSentExceedingDate: string;
    isExeededOfEmailSent: 0 | 1;

    nickname: string;
    nicknameVerifiedDate: string;
    nicknameVerifiedToken: string;
    isVerifiedNickname: 0 | 1;
}
