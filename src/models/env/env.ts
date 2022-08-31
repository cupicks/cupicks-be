import { getEnvStringValue, getEnvNumberValue, getEnvLiteralTypeValue } from "./private/env.private";
import { TALGORITHM } from "../../constants/_.lodaer";

export interface IJwtEnv {
    ACCESS_EXPIRED_IN: string;
    REFRESH_EXPIRED_IN: string;
    HASH_ALGOIRHTM: TALGORITHM;
    SECRET_KEY: string;
}

export class Env {
    PORT;

    JWT: IJwtEnv;

    constructor() {
        this.PORT = this.getEnvNumberValue("PORT");

        this.JWT = {
            ACCESS_EXPIRED_IN: this.getEnvStringValue("JWT_ACCESS_EXPIRED_IN"),
            REFRESH_EXPIRED_IN: this.getEnvStringValue("JWT_REFRESH_EXPIRED_IN"),
            HASH_ALGOIRHTM: this.getEnvLiteralTypeValue("JWT_HASH_ALGOIRHTM"),
            SECRET_KEY: this.getEnvStringValue("SECRET_KEY"),
        };
    }

    private getEnvStringValue = getEnvStringValue;
    private getEnvNumberValue = getEnvNumberValue;
    private getEnvLiteralTypeValue = getEnvLiteralTypeValue;
}
