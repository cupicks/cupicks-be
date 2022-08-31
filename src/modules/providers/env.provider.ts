import * as dotenv from "dotenv";
import { Env } from "../../models/env/env";

export default class EnvProvider {
    static init() {
        dotenv.config({
            path: ".env",
        });
    }
    public getEnvInstance(): Env {
        return new Env();
    }
}
