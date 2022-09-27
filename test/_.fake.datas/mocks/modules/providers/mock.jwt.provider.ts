import * as jwtLib from "jsonwebtoken";

type CustomTokenType =
    | "AccessToken"
    | "RefreshToken"
    | "EmailVerifyToken"
    | "NicknameVerifyToken"
    | "ResetPasswordToken";
interface ICustomPayload extends jwtLib.JwtPayload {
    type: CustomTokenType;
}

interface IAccessTokenPayload extends ICustomPayload {
    type: "AccessToken";
    userId: number;
    nickname: string;
}

interface IRefreshTokenPayload extends ICustomPayload {
    type: "RefreshToken";
    userId: number;
    email: string;
    nickname: string;
    imageUrl?: string;
}

interface IEmailVerifyToken extends ICustomPayload {
    type: "EmailVerifyToken";
    email: string;
}

interface INicknameVerifyToken extends ICustomPayload {
    type: "NicknameVerifyToken";
    nickname: string;
}

interface IResetPasswordToken extends ICustomPayload {
    type: "ResetPasswordToken";
    email: string;
    hashedPassword: string;
}

export const MockJwtProvider = {
    signAccessToken: jest.fn(),
    signRefreshToken: jest.fn(),
    signEmailVerifyToken: jest.fn(),
    signNicknameVerifyToken: jest.fn(),
    signResetPasswordToken: jest.fn(),
    decodeToken: jest.fn(),
    verifyToken: jest.fn(
        <T extends CustomTokenType>(
            type: T,
        ):
            | IAccessTokenPayload
            | IRefreshTokenPayload
            | IEmailVerifyToken
            | INicknameVerifyToken
            | IResetPasswordToken => {
            switch (type) {
                case "AccessToken":
                    const accessTokenPayload: IAccessTokenPayload = {
                        type: "AccessToken",
                        userId: 1,
                        nickname: "sample_nickname",
                    };
                    return accessTokenPayload;
                case "RefreshToken":
                    const refreshTokenPayload: IRefreshTokenPayload = {
                        type: "RefreshToken",
                        userId: 1,
                        email: "sample_email",
                        nickname: "sample_nickname",
                        imageUrl: "sample_imageUrl",
                    };
                    return refreshTokenPayload;
                case "EmailVerifyToken":
                    const emailVerifyToken: IEmailVerifyToken = {
                        type: "EmailVerifyToken",
                        email: "sample_email",
                    };
                    return emailVerifyToken;
                case "NicknameVerifyToken":
                    const nicknameVerifyToken: INicknameVerifyToken = {
                        type: "NicknameVerifyToken",
                        nickname: "sample_nickname",
                    };
                    return nicknameVerifyToken;
                case "ResetPasswordToken":
                    const resetPasswordToken: IResetPasswordToken = {
                        type: "ResetPasswordToken",
                        email: "sample_email",
                        hashedPassword: "sample_nickname",
                    };
                    return resetPasswordToken;
            }
            throw new Error("hello");
        },
    ),
    extractToken: jest.fn(),
};
