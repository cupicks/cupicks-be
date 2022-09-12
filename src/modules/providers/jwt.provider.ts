import * as jwtLib from "jsonwebtoken";
import { CustomException, IJwtEnv, JwtAuthorizationException, UnkownTypeError } from "../../models/_.loader";
import { TALGORITHM } from "../../constants/_.loader";

declare module "jsonwebtoken" {
    export type CustomTokenType =
        | "AccessToken"
        | "RefreshToken"
        | "EmailVerifyToken"
        | "NicknameVerifyToken"
        | "ResetPasswordToken";

    export interface ICustomPayload extends jwtLib.JwtPayload {
        type: CustomTokenType;
    }

    export interface IAccessTokenPayload extends ICustomPayload {
        type: "AccessToken";
        userId: number;
        nickname: string;
    }

    export interface IRefreshTokenPayload extends ICustomPayload {
        type: "RefreshToken";
        userId: number;
        email: string;
        nickname: string;
        imageUrl?: string;
    }

    export interface IEmailVerifyToken extends ICustomPayload {
        type: "EmailVerifyToken";
        email: string;
    }

    export interface INicknameVerifyToken extends ICustomPayload {
        type: "NicknameVerifyToken";
        nickname: string;
    }

    export interface IResetPasswordToken extends ICustomPayload {
        type: "ResetPasswordToken";
        email: string;
        hashedPassword: string;
    }
}

export class JwtProvider {
    static isInit = false;
    static ACCESS_EXPIRED_IN: string;
    static REFRESH_EXPIRED_IN: string;
    static VERIFY_EXPIRED_IN: string;
    static HASH_ALGOIRHTM: TALGORITHM;
    static HASH_PRIVATE_PEM_KEY: string;
    static HASH_PUBLIC_PEM_KEY: string;
    static HASH_PASSPHRASE: string;

    static init({
        ACCESS_EXPIRED_IN,
        REFRESH_EXPIRED_IN,
        VERIFY_EXPIRED_IN,
        HASH_ALGOIRHTM,
        HASH_PRIVATE_PEM_KEY,
        HASH_PUBLIC_PEM_KEY,
        HASH_PASSPHRASE,
    }: IJwtEnv) {
        if (this.isInit === true) return;

        this.ACCESS_EXPIRED_IN = ACCESS_EXPIRED_IN;
        this.REFRESH_EXPIRED_IN = REFRESH_EXPIRED_IN;
        this.VERIFY_EXPIRED_IN = VERIFY_EXPIRED_IN;

        this.HASH_ALGOIRHTM = HASH_ALGOIRHTM;
        this.HASH_PRIVATE_PEM_KEY = HASH_PRIVATE_PEM_KEY;
        this.HASH_PUBLIC_PEM_KEY = HASH_PUBLIC_PEM_KEY;
        this.HASH_PASSPHRASE = HASH_PASSPHRASE;
        this.isInit = true;
    }

    public signAccessToken(payload: jwtLib.IAccessTokenPayload): string {
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

    public signRefreshToken(payload: jwtLib.IRefreshTokenPayload): string {
        this.validateIsInit();

        return jwtLib.sign(
            payload,
            {
                key: JwtProvider.HASH_PRIVATE_PEM_KEY,
                passphrase: JwtProvider.HASH_PASSPHRASE,
            },
            {
                expiresIn: JwtProvider.REFRESH_EXPIRED_IN,
                algorithm: JwtProvider.HASH_ALGOIRHTM,
            },
        );
    }

    public signEmailVerifyToken(payload: jwtLib.IEmailVerifyToken): string {
        this.validateIsInit();

        return jwtLib.sign(
            payload,
            {
                key: JwtProvider.HASH_PRIVATE_PEM_KEY,
                passphrase: JwtProvider.HASH_PASSPHRASE,
            },
            {
                expiresIn: JwtProvider.VERIFY_EXPIRED_IN,
                algorithm: JwtProvider.HASH_ALGOIRHTM,
            },
        );
    }

    public signNicknameVerifyToken(payload: jwtLib.INicknameVerifyToken): string {
        this.validateIsInit();

        return jwtLib.sign(
            payload,
            {
                key: JwtProvider.HASH_PRIVATE_PEM_KEY,
                passphrase: JwtProvider.HASH_PASSPHRASE,
            },
            {
                expiresIn: JwtProvider.VERIFY_EXPIRED_IN,
                algorithm: JwtProvider.HASH_ALGOIRHTM,
            },
        );
    }

    public signResetPasswordToken(payload: jwtLib.IResetPasswordToken): string {
        this.validateIsInit();

        return jwtLib.sign(
            payload,
            {
                key: JwtProvider.HASH_PRIVATE_PEM_KEY,
                passphrase: JwtProvider.HASH_PASSPHRASE,
            },
            {
                expiresIn: JwtProvider.VERIFY_EXPIRED_IN,
                algorithm: JwtProvider.HASH_ALGOIRHTM,
            },
        );
    }

    /** @throws { CustomException } */
    public decodeToken<T extends jwtLib.ICustomPayload>(token: string): T {
        this.validateIsInit();

        try {
            return <T>jwtLib.decode(token);
        } catch (err) {
            throw this.errorHandler(err);
        }
    }

    /**
     * 1주차 기술 피드백 - https://github.com/cupicks/cupicks-be/issues/51
     *
     * - 이슈 [Bug : JwtProvider.prototype.decoe 및 verify 사용 불가](https://github.com/cupicks/cupicks-be/issues/28)
     *
     * 위 이슈 때문에 아래와 같이 코드를 개선을 했는데, return jwtLib.verify 로 쓰면 에러가 발생합니다.
     * 그런데 <T> 라는 것을 그 앞에 써주면 에러가 사라지는데 <T> 는 무슨 역할을 하는 걸까요?
     *
     *
     * 현재 이 메서드는 ***지네릭 타입*** 을 이용해서 2 가지 타입의 리턴을 보내고 있습니다.
     * 따라서, 구체적으로 어떤 친구를 리턴하는지 명시해줘야 하며 그것이 return <T> jwt.verify 의 형태입니다.
     *
     * 단,
     *
     * 이렇게 ***지네릭 메서드*** 는 가독성을 해칠 수 있기 때문에 다른 개발자들이 읽기 힘들 수 있습니다.
     * Token 과 같이 모든 팀원이 이해하는 부분에서는 좋은 방법이지만, Dto 같은 곳에서는 안티 패턴이 될 수 있습니다.
     *
     * 메서드 숫자가 늘어나는 것정 될 수는 있으나, 그것보다는 같은 팀원이 쉽게 읽을 수 있는 방향이 좋은 것 같습니다.
     * @throws { CustomException }
     */
    public verifyToken<T extends jwtLib.ICustomPayload>(token: string): T {
        this.validateIsInit();

        try {
            return <T>jwtLib.verify(token, JwtProvider.HASH_PUBLIC_PEM_KEY, {
                algorithms: ["RS256"],
            });
        } catch (err) {
            throw this.errorHandler(err);
        }
    }

    public extractToken(bearerToken: string): string {
        return bearerToken.substring(7);
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
