import { PoolConnection } from "mysql2/promise";
import { IUserVerifyListPacket } from "../../../../../src/models/_.loader";

export const MockAuthVerifyListRepository = {
    isExistsbyEmail: jest.fn(),
    isExistsByNicknameExceptEmail: jest.fn(),
    findVerifyListByEmail: jest.fn(
        async (conn: PoolConnection, email: string): Promise<IUserVerifyListPacket | null> => {
            if (email.length > 1)
                return {
                    userVerifyListId: 123,

                    email: "sample_email",
                    emailVerifiedDate: "sample_email_verified_date",
                    emailVerifiedToken: "sample_email_verified_token",
                    emailVerifiedCode: "sample_email_verified_code",
                    isVerifiedEmail: 1,

                    currentEmailSentCount: 1,
                    emailSentExceedingDate: "sample_email_sent_exceeding_date",
                    isExeededOfEmailSent: 1,

                    nickname: "sample_nickname",
                    nicknameVerifiedDate: "sample_nickname_verified_date",
                    nicknameVerifiedToken: "sample_nickname_verified_token",
                    isVerifiedNickname: 1,
                    constructor: {
                        name: "RowDataPacket",
                    },
                };
            else return null;
        },
    ),
    createVerifyListByEmailAndCode: jest.fn(),
    updateVerifyListByIdAndCode: jest.fn(),
    updateVerifyListByEmailAndEmailVerifyToken: jest.fn(),
    updateVerifyListByNickname: jest.fn(),
    reUpdateVerifyListByIdAndCode: jest.fn(),
    reUpdateVerifyListByEmailAndEmailVerifyToken: jest.fn(),
    exceedOfEmailSent: jest.fn(),
    disableExceedOfEmailSent: jest.fn(),
};
