import { Router } from "express";
import { preventLoginUserGuard } from "../../middlewares/guards/_.exporter";
import { applicationXWwwFormUrlencodedFilter } from "../../middlewares/filters/_.exporter";
import { AuthController } from "../controllers/_.exporter";

const authRouter: Router = Router();
authRouter.post("/signup", preventLoginUserGuard, new AuthController().signup);
authRouter.post("/signin", applicationXWwwFormUrlencodedFilter, preventLoginUserGuard, new AuthController().signin);
authRouter.get("/token", applicationXWwwFormUrlencodedFilter, new AuthController().publishToken);

export default authRouter;
