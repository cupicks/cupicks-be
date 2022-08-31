import App from "./app";
import Env from "./models/env/env";
import EnvProvider from "./modules/providers/env.provider";
import { getNodeEnvValue } from "./models/env/private/env.private";
import { TNODE_ENV } from "./constants/_.loader";
import { BcryptProvider } from "./modules/_.loader";

/**
 * `IIFE`
 */
(() => {
    EnvProvider.init();
    const MODE: TNODE_ENV = getNodeEnvValue("NODE_ENV");
    const envProvider: EnvProvider = new EnvProvider();
    const env: Env = envProvider.getEnvInstance();

    // bcrypt
    BcryptProvider.init(env.SALT);

    new App(MODE, env.PORT);
})();
