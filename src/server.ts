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
import { AuthController } from "./routes/controllers/_.exporter";

/**
 * `IIFE`
 */
export default (async () => {
    const MODE: TNODE_ENV = getNodeEnvValue("NODE_ENV");
    EnvProvider.init(MODE);

    const envProvider: EnvProvider = new EnvProvider();
    const env: Env = envProvider.getEnvInstance();

    await MysqlProvider.init(env.MYSQL);

    JwtProvider.init(env.JWT);
    BcryptProvider.init(env.SALT);
    MulterProvider.init(env.S3);
    AwsSesProvider.init(env.SES, env.URL.SERVER_URL_WITH_PORT, env.URL.FROTN_REDIRECT_URL_WITHOUT_PORT);

    AuthController.init(env.URL.FROTN_REDIRECT_URL_WITHOUT_PORT);

    const appInstance = new App(MODE, env.PORT, env.URL.CORS_URL_LIST_WITHOUT_PORT);

    return appInstance.app;
})();
