import App from "./app";
import EnvProvider from "./modules/providers/env.provider";
import { getNodeEnvValue } from "./models/env/private/env.private";
import { TNODE_ENV } from "./constants/_.lodaer";
import { JwtProvider } from "./modules/_.lodaer";
import { Env } from "./models/_.loader";

/**
 * `IIFE`
 */
(() => {
    EnvProvider.init();

    const MODE: TNODE_ENV = getNodeEnvValue("NODE_ENV");
    const envProvider: EnvProvider = new EnvProvider();
    const env: Env = envProvider.getEnvInstance();

    JwtProvider.init(env.JWT);

    new App(MODE, env.PORT);
})();
