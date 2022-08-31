import App from "./app";
import { getNodeEnvValue } from "./models/env/private/env.private";

import { Env } from "./models/_.loader";
import { TNODE_ENV } from "./constants/_.loader";
import { BcryptProvider, EnvProvider, JwtProvider, MysqlProvider } from "./modules/_.loader";

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

    new App(MODE, env.PORT);
})();
