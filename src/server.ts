import App from "./app";

import { getNodeEnvValue } from "./models/env/private/env.private";
import { Env } from "./models/_.loader";
import { TNODE_ENV } from "./constants/_.loader";
import { BcryptProvider, EnvProvider, JwtProvider, MysqlProvider, MulterProvider } from "./modules/_.loader";

import * as jwt from "jsonwebtoken";

/**
 * `IIFE`
 */
(async () => {
    EnvProvider.init();

    const MODE: TNODE_ENV = getNodeEnvValue("NODE_ENV");
    const envProvider: EnvProvider = new EnvProvider();
    const env: Env = envProvider.getEnvInstance();

    JwtProvider.init(env.JWT);
    BcryptProvider.init(env.SALT);
    MysqlProvider.init(env.MYSQL);
    MulterProvider.init(env.S3);

    new App(MODE, env.PORT);
})();
