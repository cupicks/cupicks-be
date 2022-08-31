import { getEnvStringValue, getEnvNumberValue, getEnvLiteralTypeValue } from "./private/env.private";
import { TALGORITHM } from "../../constants/_.loader";

export interface IJwtEnv {
    ACCESS_EXPIRED_IN: string;
    REFRESH_EXPIRED_IN: string;
    HASH_ALGOIRHTM: TALGORITHM;
    SECRET_KEY: string;
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

    JWT: IJwtEnv;
    MYSQL: IMysqlEnv;
    S3: IS3ConfigEnv;

    constructor() {
        this.PORT = this.getEnvNumberValue("PORT");
        this.SALT = this.getEnvNumberValue("SALT");
        this.JWT = {
            ACCESS_EXPIRED_IN: this.getEnvStringValue("JWT_ACCESS_EXPIRED_IN"),
            REFRESH_EXPIRED_IN: this.getEnvStringValue("JWT_REFRESH_EXPIRED_IN"),
            HASH_ALGOIRHTM: this.getEnvLiteralTypeValue("JWT_HASH_ALGOIRHTM"),
            SECRET_KEY: this.getEnvStringValue("SECRET_KEY"),
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
}
