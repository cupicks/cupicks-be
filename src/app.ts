import * as cors from "cors";
import * as morgan from "morgan";
import * as express from "express";
import { TNODE_ENV } from "constants/_.lodaer";

import { authRouter } from "./routes/routers/_.exporter";

/**
 * `Singleton`
 */
export default class App {
    app: express.Application;

    constructor(MODE: TNODE_ENV, PORT: number) {
        this.app = express();

        this.setMiddleware(MODE);
        this.runServer(MODE, PORT);
    }

    setMiddleware(MODE: TNODE_ENV) {
        if (MODE === "dev") {
            this.app.use(cors());
            this.app.use(morgan("dev"));
        } else if (MODE === "prod") {
            this.app.use(cors());
            this.app.use(morgan("combined"));
        } else {
            this.app.use(cors());
        }
    }

    setRouter() {
        this.app.use("/api/auth", authRouter);
    }

    runServer(MODE: TNODE_ENV, PORT: number) {
        this.app.listen(PORT, () => {
            if (MODE !== "test") console.log(`Server is running on ${PORT} with ${MODE} MODE`);
        });
    }
}