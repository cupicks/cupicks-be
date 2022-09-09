import * as cors from "cors";
import * as morgan from "morgan";
import * as express from "express";
import { TNODE_ENV } from "constants/_.loader";

import { authRouter, profileRouter, recipeRouter, commentRouter } from "./routes/routers/_.exporter";

import { getCorsMiddleware } from "./middlewares/guards/_.exporter";
import { Server } from "http";

/**
 * `Singleton`
 */
export default class App {
    static app: express.Application;

    constructor(MODE: TNODE_ENV, PORT: number, CORS_ORIGIN_LIST: string[]) {
        App.app = express();

        this.setMiddleware(MODE, CORS_ORIGIN_LIST);
        this.setRouter();
    }

    setMiddleware(MODE: TNODE_ENV, CORS_ORIGIN_LIST: string[]) {
        if (MODE === "dev") {
            App.app;
            App.app.use(morgan("dev"));
        } else if (MODE === "prod") {
            App.app.use(morgan("combined"));
        }

        App.app.use(getCorsMiddleware(CORS_ORIGIN_LIST));
        App.app.use(express.json());
        App.app.use(express.urlencoded({ extended: true }));
    }

    setRouter() {
        App.app.use("/api/auth", authRouter);
        App.app.use("/api/profile", profileRouter);
        App.app.use("/api/recipes", recipeRouter);
        App.app.use("/api/comments", commentRouter);
    }

    runServer(MODE: TNODE_ENV, PORT: number): Server {
        return App.app.listen(PORT, () => {
            if (MODE !== "test") console.log(`Server is running on ${PORT} with ${MODE} MODE`);
        });
    }
}
