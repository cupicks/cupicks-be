import Env from './models/env/env';
import EnvProvider from './modules/providers/env.provider';


(() => {
    const env: Env = new EnvProvider().getEnvInstance();
})();