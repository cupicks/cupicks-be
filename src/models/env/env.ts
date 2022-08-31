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

export class Env {
    PORT;
    SALT;

    JWT: IJwtEnv;
    MYSQL: IMysqlEnv;

    constructor() {
        this.PORT = this.getEnvNumberValue("PORT");

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
        this.SALT = this.getEnvNumberValue("SALT");
    }

    private getEnvStringValue = getEnvStringValue;
    private getEnvNumberValue = getEnvNumberValue;
    private getEnvLiteralTypeValue = getEnvLiteralTypeValue;
}
