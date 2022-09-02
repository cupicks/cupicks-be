import { getEnvStringValue, getEnvNumberValue, getEnvLiteralTypeValue, getPemKey } from "./private/env.private";
import { TALGORITHM } from "../../constants/_.loader";

export interface IJwtEnv {
    ACCESS_EXPIRED_IN: string;
    REFRESH_EXPIRED_IN: string;
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

export class Env {
    PORT;

    SALT;

    CORS_ORIGIN_LIST: string[];

    JWT: IJwtEnv;
    MYSQL: IMysqlEnv;
    S3: IS3ConfigEnv;

    constructor() {
        this.PORT = this.getEnvNumberValue("PORT");

        this.SALT = this.getEnvNumberValue("SALT");

        this.CORS_ORIGIN_LIST = [this.getEnvStringValue("CORS_ORIGIN_ONE")];

        this.JWT = {
            ACCESS_EXPIRED_IN: this.getEnvStringValue("JWT_ACCESS_EXPIRED_IN"),
            REFRESH_EXPIRED_IN: this.getEnvStringValue("JWT_REFRESH_EXPIRED_IN"),
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
    }

    private getEnvStringValue = getEnvStringValue;
    private getEnvNumberValue = getEnvNumberValue;
    private getEnvLiteralTypeValue = getEnvLiteralTypeValue;
    private getPemKey = getPemKey;
}
