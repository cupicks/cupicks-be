import App from "./app";

import { getNodeEnvValue } from "./models/env/private/env.private";
import { Env } from "./models/_.loader";
import { TNODE_ENV } from "./constants/_.loader";
import {
    BcryptProvider,
    EnvProvider,
    JwtProvider,
    MysqlProvider,
    MulterProvider,
    AwsSesProvider,
} from "./modules/_.loader";

/**
 * `IIFE`
 */
(async () => {
    const MODE: TNODE_ENV = getNodeEnvValue("NODE_ENV");
    EnvProvider.init(MODE);

    const envProvider: EnvProvider = new EnvProvider();
    const env: Env = envProvider.getEnvInstance();

    JwtProvider.init(env.JWT);
    BcryptProvider.init(env.SALT);
    MysqlProvider.init(env.MYSQL);
    MulterProvider.init(env.S3);
    AwsSesProvider.init(env.SES, env.URL.SERVER_URL_WITH_PORT);

    new App(MODE, env.PORT, env.URL.FRONT_URL_LIST_WITHOUT_PORT);
})();
