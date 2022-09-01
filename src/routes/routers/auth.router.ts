import { Router } from "express";
import { applicationXWwwFormUrlencodedFilter } from "../../middlewares/filters/_.exporter";
import { AuthController } from "../controllers/_.exporter";

const authRouter: Router = Router();
authRouter.post("/signup", new AuthController().signup);
authRouter.post("/signin", applicationXWwwFormUrlencodedFilter, new AuthController().signin);

export default authRouter;
