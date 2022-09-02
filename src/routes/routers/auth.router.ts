import { Router } from "express";
import { preventLoginUserGuard } from "../../middlewares/guards/_.exporter";
import { applicationXWwwFormUrlencodedFilter } from "../../middlewares/filters/_.exporter";
import { AuthController } from "../controllers/_.exporter";
import { MulterProvider } from "../../modules/_.loader";

const authRouter: Router = Router();
authRouter.post("/signup", preventLoginUserGuard, MulterProvider.uploadSingle, new AuthController().signup);
authRouter.post("/signin", applicationXWwwFormUrlencodedFilter, preventLoginUserGuard, new AuthController().signin);
authRouter.get("/token", applicationXWwwFormUrlencodedFilter, new AuthController().publishToken);

export default authRouter;
