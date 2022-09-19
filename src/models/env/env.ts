import { getEnvStringValue, getEnvNumberValue, getEnvLiteralTypeValue, getPemKey } from "./private/env.private";
import { TALGORITHM } from "../../constants/_.loader";

export interface IJwtEnv {
    ACCESS_EXPIRED_IN: string;
    REFRESH_EXPIRED_IN: string;
    VERIFY_EXPIRED_IN: string;
    RESET_EXPIRED_IN: string;

    HASH_ALGOIRHTM: TALGORITHM;

    HASH_PRIVATE_PEM_KEY: string;
    HASH_PUBLIC_PEM_KEY: string;
    HASH_PASSPHRASE: string;
}

export interface IMysqlEnv {
    HOST: string;
    USER: string;
    DATABASE: string;
    PASSWORD: string;
    CONNECTION_LIMIT: number;
}

export interface IS3ConfigEnv {
    S3_ACCESS_KEY: string;
    S3_SECRET_KEY: string;
    REGION: string;
    BUCKET: string;
}

export interface ISesConfigEnv {
    SES_API_VERSION: string;
    SES_API_REGION: string;
    SES_ACCESS_KEY: string;
    SES_SECRET_KEY: string;
    SES_SENDER_EMAIL: string;
}

export interface IUrlEnv {
    CORS_URL_LIST_WITHOUT_PORT: string[];
    FROTN_REDIRECT_URL_WITHOUT_PORT: string;
    SERVER_URL_WITH_PORT: string;
}

export class Env {
    PORT;

    SALT;

    URL: IUrlEnv;
    JWT: IJwtEnv;
    MYSQL: IMysqlEnv;
    S3: IS3ConfigEnv;
    SES: ISesConfigEnv;

    constructor() {
        this.PORT = this.getEnvNumberValue("PORT");

        this.SALT = this.getEnvNumberValue("SALT");

        this.URL = {
            CORS_URL_LIST_WITHOUT_PORT: [
                this.getEnvStringValue("CORS_URL_ONE_WITHOUT_PORT"),
                this.getEnvStringValue("CORS_URL_TWO_WITHOUT_PORT"),
                this.getEnvStringValue("CORS_URL_THREE_WITHOUT_PORT"),
                this.getEnvStringValue("CORS_URL_FOUR_WITHOUT_PORT"),
            ],
            FROTN_REDIRECT_URL_WITHOUT_PORT: this.getEnvStringValue("FROTN_REDIRECT_URL_WITHOUT_PORT"),
            SERVER_URL_WITH_PORT: this.getEnvStringValue("SERVER_URL_WITH_PORT"),
        };

        this.JWT = {
            ACCESS_EXPIRED_IN: this.getEnvStringValue("JWT_ACCESS_EXPIRED_IN"),
            REFRESH_EXPIRED_IN: this.getEnvStringValue("JWT_REFRESH_EXPIRED_IN"),
            VERIFY_EXPIRED_IN: this.getEnvStringValue("JWT_VERIFY_EXPIRED_IN"),
            RESET_EXPIRED_IN: this.getEnvStringValue("JWT_RESET_EXPIRED_IN"),

            HASH_ALGOIRHTM: this.getEnvLiteralTypeValue("JWT_HASH_ALGOIRHTM"),
            HASH_PRIVATE_PEM_KEY: this.getPemKey("private"),
            HASH_PUBLIC_PEM_KEY: this.getPemKey("public"),
            HASH_PASSPHRASE: this.getEnvStringValue("HASH_PASSPHRASE"),
        };

        this.MYSQL = {
            HOST: this.getEnvStringValue("MYSQL_HOST"),
            USER: this.getEnvStringValue("MYSQL_USER"),
            DATABASE: this.getEnvStringValue("MYSQL_DATABASE"),
            PASSWORD: this.getEnvStringValue("MYSQL_PASSWORD"),
            CONNECTION_LIMIT: this.getEnvNumberValue("MYSQL_CONNECTION_LIMIT"),
        };

        this.S3 = {
            S3_ACCESS_KEY: this.getEnvStringValue("S3_ACCESS_KEY"),
            S3_SECRET_KEY: this.getEnvStringValue("S3_SECRET_KEY"),
            REGION: this.getEnvStringValue("REGION"),
            BUCKET: this.getEnvStringValue("BUCKET"),
        };

        this.SES = {
            SES_API_VERSION: this.getEnvStringValue("SES_API_VERSION"),
            SES_API_REGION: this.getEnvStringValue("SES_API_REGION"),
            SES_ACCESS_KEY: this.getEnvStringValue("SES_ACCESS_KEY"),
            SES_SECRET_KEY: this.getEnvStringValue("SES_SECRET_KEY"),
            SES_SENDER_EMAIL: this.getEnvStringValue("SES_SENDER_EMAIL"),
        };
    }

    private getEnvStringValue = getEnvStringValue;
    private getEnvNumberValue = getEnvNumberValue;
    private getEnvLiteralTypeValue = getEnvLiteralTypeValue;
    private getPemKey = getPemKey;
}
