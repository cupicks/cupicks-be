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
        this.SALT = this.getEnvNumberValue("SALT");
    }

    private getEnvStringValue = getEnvStringValue;
    private getEnvNumberValue = getEnvNumberValue;
    private getEnvLiteralTypeValue = getEnvLiteralTypeValue;
    private getPemKey = getPemKey;
}
