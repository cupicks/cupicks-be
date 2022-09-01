import * as jwtLib from "jsonwebtoken";
import { CustomException, IJwtEnv, JwtAuthorizationException, UnkownTypeError } from "../../models/_.loader";
import { TALGORITHM } from "../../constants/_.loader";

declare module "jsonwebtoken" {
    export interface IAccessTokenPayload extends jwtLib.JwtPayload {
        userId: number;
    }

    export interface IRefreshTokenPayload extends jwtLib.JwtPayload {
        userId: number;
        email: string;
        nickname: string;
    }
}

export class JwtProvider {
    static isInit = false;
    static ACCESS_EXPIRED_IN: string;
    static REFRESH_EXPIRED_IN: string;
    static HASH_ALGOIRHTM: TALGORITHM;
    static HASH_PRIVATE_PEM_KEY: string;
    static HASH_PUBLIC_PEM_KEY: string;
    static HASH_PASSPHRASE: string;

    static init({
        ACCESS_EXPIRED_IN,
        REFRESH_EXPIRED_IN,
        HASH_ALGOIRHTM,
        HASH_PRIVATE_PEM_KEY,
        HASH_PUBLIC_PEM_KEY,
        HASH_PASSPHRASE,
    }: IJwtEnv) {
        if (this.isInit === true) return;

        this.ACCESS_EXPIRED_IN = ACCESS_EXPIRED_IN;
        this.REFRESH_EXPIRED_IN = REFRESH_EXPIRED_IN;
        this.HASH_ALGOIRHTM = HASH_ALGOIRHTM;
        this.HASH_PRIVATE_PEM_KEY = HASH_PRIVATE_PEM_KEY;
        this.HASH_PUBLIC_PEM_KEY = HASH_PUBLIC_PEM_KEY;
        this.HASH_PASSPHRASE = HASH_PASSPHRASE;
        this.isInit = true;
    }

    public sign<T extends jwtLib.IAccessTokenPayload | jwtLib.IRefreshTokenPayload>(payload: T): string {
        this.validateIsInit();

        return jwtLib.sign(
            payload,
            {
                key: JwtProvider.HASH_PRIVATE_PEM_KEY,
                passphrase: JwtProvider.HASH_PASSPHRASE,
            },
            {
                expiresIn: JwtProvider.ACCESS_EXPIRED_IN,
                algorithm: JwtProvider.HASH_ALGOIRHTM,
            },
        );
    }

    /** @throws { CustomException } */
    public decodeToken<T extends jwtLib.IAccessTokenPayload | jwtLib.IRefreshTokenPayload>(token: string): T {
        this.validateIsInit();

        try {
            return <T>jwtLib.decode(token);
        } catch (err) {
            throw this.errorHandler(err);
        }
    }

    /** @throws { CustomException } */
    public verifyToken<T extends jwtLib.IAccessTokenPayload | jwtLib.IRefreshTokenPayload>(token: string): T {
        this.validateIsInit();

        try {
            return <T>jwtLib.verify(token, JwtProvider.HASH_PUBLIC_PEM_KEY, {
                algorithms: ["RS256"],
            });
        } catch (err) {
            throw this.errorHandler(err);
        }
    }

    private validateIsInit = () => {
        if (JwtProvider.isInit === false) throw new Error(`JwtProvider 는 init 전에 사용할 수 없습니다.`);
    };

    private errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new JwtAuthorizationException(err.message);
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };
}
