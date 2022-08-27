import Env from "../../models/env/env";

export default class EnvProvider {

    public getEnvInstance(): Env {
        return new Env();
    }

}