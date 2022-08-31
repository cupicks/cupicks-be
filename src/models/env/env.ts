import { getEnvStringValue, getEnvNumberValue } from "./private/env.private";

export default class Env {
    PORT;
    SALT;

    constructor() {
        this.PORT = this.getEnvNumberValue("PORT");
        this.SALT = this.getEnvNumberValue("SALT");
    }

    private getEnvStringValue = getEnvStringValue;
    private getEnvNumberValue = getEnvNumberValue;
}
