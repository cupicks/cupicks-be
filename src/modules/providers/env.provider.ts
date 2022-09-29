import dotenv from "dotenv";
import { Env } from "../../models/env/env";
import { TNODE_ENV } from "../../constants/_.loader";

export class EnvProvider {
    static init(MODE: TNODE_ENV) {
        if (MODE !== "prod") {
            dotenv.config({
                path: MODE === "dev" ? ".env.dev" : ".env.test",
            });
        }
    }
    public getEnvInstance(): Env {
        return new Env();
    }
}
