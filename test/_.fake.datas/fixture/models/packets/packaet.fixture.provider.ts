import { faker } from "@faker-js/faker";
import { IUserPacket, IUserRefresthTokenPacket, IUserVerifyListPacket } from "../../../../../src/models/_.loader";

export class PacketFixtureProvider {
    public getIUserPacket({
        userId,
        email,
        imageUrl,
        resizedUrl,
        nickname,
        password,
        currentPasswordSentCount,
        isExeededOfPasswordSent,
        passwordSentExceedingDate,
        resetPasswordDate,
        resetPasswordToken,
    }: {
        userId?: number;
        email?: string;
        imageUrl?: string;
        resizedUrl?: string;
        nickname?: string;
        password?: string;
        currentPasswordSentCount?: number;
        isExeededOfPasswordSent?: 0 | 1;
        passwordSentExceedingDate?: string;
        resetPasswordDate?: string;
        resetPasswordToken?: string;
    }): IUserPacket {
        return {
            constructor: {
                name: "RowDataPacket",
            },
            userId: userId ?? +faker.random.numeric(9),
            email: email ?? faker.internet.email(),
            imageUrl: imageUrl ?? faker.internet.url(),
            resizedUrl: resizedUrl ?? faker.internet.url(),
            nickname: nickname ?? faker.internet.userName().substring(0, 10),
            password: password ?? faker.internet.password().padStart(8, "a").substring(0, 14) + "@",
            currentPasswordSentCount:
                currentPasswordSentCount ??
                +faker.random.numeric(1, {
                    bannedDigits: ["6", "7", "8", "9"],
                }),
            isExeededOfPasswordSent: isExeededOfPasswordSent ?? faker.datatype.boolean() ? 1 : 0,
            passwordSentExceedingDate: passwordSentExceedingDate ?? faker.date.recent().toString(),
            resetPasswordDate: resetPasswordDate ?? faker.date.recent().toString(),
            resetPasswordToken: resetPasswordToken ?? faker.word.noun(),
        };
    }
    public getIUserRefresthTokenPacket({
        userId,
        refreshToken,
    }: {
        userId?: number;
        refreshToken?: string;
    }): IUserRefresthTokenPacket {
        return {
            constructor: {
                name: "RowDataPacket",
            },
            userId: userId ?? +faker.random.numeric(9),
            refreshToken: refreshToken ?? faker.word.noun(),
        };
    }

    public getIUserVerifyListPacket({
        userVerifyListId,
        email,
        nickname,
        nicknameVerifiedDate,
        emailSentExceedingDate,
        emailVerifiedDate,
        currentEmailSentCount,
        emailVerifiedCode,
        emailVerifiedToken,
        nicknameVerifiedToken,
        isExeededOfEmailSent,
        isVerifiedNickname,
        isVerifiedEmail,
    }: {
        userVerifyListId?: number;
        email?: string;
        nickname?: string;
        nicknameVerifiedDate?: string;
        emailSentExceedingDate?: string;
        emailVerifiedDate?: string;
        currentEmailSentCount?: number;
        emailVerifiedCode?: string;
        emailVerifiedToken?: string;
        nicknameVerifiedToken?: string;
        isExeededOfEmailSent?: 0 | 1;
        isVerifiedEmail?: 0 | 1;
        isVerifiedNickname?: 0 | 1;
    }): IUserVerifyListPacket {
        return {
            constructor: {
                name: "RowDataPacket",
            },
            userVerifyListId: userVerifyListId ?? +faker.random.numeric(9),
            email: email ?? faker.internet.email(),

            nickname: nickname ?? faker.internet.userName().substring(0, 10),
            nicknameVerifiedDate: nicknameVerifiedDate ?? faker.date.recent().toString(),
            nicknameVerifiedToken: nicknameVerifiedToken ?? faker.word.noun(),

            emailVerifiedDate: emailVerifiedDate ?? faker.date.recent().toString(),
            emailSentExceedingDate: emailSentExceedingDate ?? faker.date.recent().toString(),
            emailVerifiedToken: emailVerifiedToken ?? faker.word.noun(),
            emailVerifiedCode:
                emailVerifiedCode ??
                faker.random.numeric(6, {
                    allowLeadingZeros: true,
                }),
            currentEmailSentCount:
                currentEmailSentCount ??
                +faker.random.numeric(1, {
                    bannedDigits: ["6", "7", "8", "9"],
                }),

            isExeededOfEmailSent: isExeededOfEmailSent ?? faker.datatype.boolean() ? 1 : 0,
            isVerifiedEmail: isVerifiedEmail ?? faker.datatype.boolean() ? 1 : 0,
            isVerifiedNickname: isVerifiedNickname ?? faker.datatype.boolean() ? 1 : 0,
        };
    }
}
