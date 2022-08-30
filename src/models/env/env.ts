import { getEnvStringValue, getEnvNumberValue } from "./private/env.private";

export default class Env {
    PORT;

    constructor() {
        this.PORT = this.getEnvNumberValue("PORT");
    }

    private getEnvStringValue = getEnvStringValue;
    private getEnvNumberValue = getEnvNumberValue;
}
