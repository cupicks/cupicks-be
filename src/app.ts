import cors from "cors";
import morgan from "morgan";
import express from "express";
import { TNODE_ENV } from "constants/_.loader";

import { authRouter, profileRouter, recipeRouter, commentRouter, rankingRouter } from "./routes/routers/_.exporter";

import { getCorsMiddleware } from "./middlewares/guards/_.exporter";

/**
 * `Singleton`
 */
export default class App {
    app: express.Application;

    constructor(MODE: TNODE_ENV, PORT: number, CORS_URL_LIST_WITHOUT_PORT: string[]) {
        this.app = express();

        this.setMiddleware(MODE, CORS_URL_LIST_WITHOUT_PORT);
        this.setRouter();
        this.runServer(MODE, PORT);
    }

    setMiddleware(MODE: TNODE_ENV, CORS_URL_LIST_WITHOUT_PORT: string[]) {
        if (MODE === "dev") {
            this.app;
            this.app.use(morgan("dev"));
        } else if (MODE === "prod") {
            this.app.use(morgan("combined"));
        }

        this.app.use(getCorsMiddleware(CORS_URL_LIST_WITHOUT_PORT));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    setRouter() {
        this.app.use("/api/auth", authRouter);
        this.app.use("/api/profile", profileRouter);
        this.app.use("/api/recipes", recipeRouter);
        this.app.use("/api/comments", commentRouter);
        this.app.use("/api/ranking", rankingRouter);
    }

    runServer(MODE: TNODE_ENV, PORT: number) {
        this.app.listen(PORT, () => {
            if (MODE !== "test") console.log(`Server is running on ${PORT} with ${MODE} MODE`);
        });
    }
}
