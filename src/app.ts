import * as cors from "cors";
import * as morgan from "morgan";
import * as express from "express";
import { TNODE_ENV } from "constants/_.loader";

import { authRouter, recipeRouter, commentRouter } from "./routes/routers/_.exporter";

import { getCorsMiddleware } from "./middlewares/guards/_.exporter";

/**
 * `Singleton`
 */
export default class App {
    app: express.Application;

    constructor(MODE: TNODE_ENV, PORT: number, CORS_ORIGIN_LIST: string[]) {
        this.app = express();

        this.setMiddleware(MODE, CORS_ORIGIN_LIST);
        this.setRouter();
        this.runServer(MODE, PORT);
    }

    setMiddleware(MODE: TNODE_ENV, CORS_ORIGIN_LIST: string[]) {
        if (MODE === "dev") {
            this.app;
            this.app.use(morgan("dev"));
        } else if (MODE === "prod") {
            this.app.use(morgan("combined"));
        }

        this.app.use(getCorsMiddleware(CORS_ORIGIN_LIST));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    setRouter() {
        this.app.use("/api/auth", authRouter);
        this.app.use("/api/recipes", recipeRouter);
        this.app.use("/api/comments", commentRouter);
    }

    runServer(MODE: TNODE_ENV, PORT: number) {
        this.app.listen(PORT, () => {
            if (MODE !== "test") console.log(`Server is running on ${PORT} with ${MODE} MODE`);
        });
    }
}
