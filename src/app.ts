import * as cors from "cors";
import * as morgan from "morgan";
import * as express from "express";
import { TNODE_ENV } from "constants/_.loader";

import { authRouter, recipeRouter } from "./routes/routers/_.exporter";

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
            this.app.use(cors());
            this.app.use(morgan("dev"));
        } else if (MODE === "prod") {
            this.app.use(morgan("combined"));
        } else {
            this.app.use(cors());
        }

        // this.app.use(getCorsMiddleware(CORS_ORIGIN_LIST));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // React 에서 JSON.stringify(formData)

        // Multer 미들웨어를 쓰고 일단 업로드하고 유저 있는지 확인
        // - 유저 확인하는 미들웨어 넣는 게 ...
        // - multer 안에서 repo 를 열라는 사람도 있었는데 ...
        // - multer 안에서 filter 안에서 사용하는 사람도 있었는데 ...

        // parsing 라이브러리나 솔루션을 찾아서 multipart/form-data 를 파싱하는 것
    }

    setRouter() {
        this.app.use("/api/auth", authRouter);
        this.app.use("/api/recipes", recipeRouter);
    }

    runServer(MODE: TNODE_ENV, PORT: number) {
        this.app.listen(PORT, () => {
            if (MODE !== "test") console.log(`Server is running on ${PORT} with ${MODE} MODE`);
        });
    }
}
