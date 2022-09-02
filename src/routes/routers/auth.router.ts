import { Router } from "express";
import { preventLoginUserGuard, preventUnLoginUserGuard } from "../../middlewares/guards/_.exporter";
import {
    applicationJsonFilter,
    applicationXWwwFormUrlencodedFilter,
    formDataFilter,
} from "../../middlewares/filters/_.exporter";
import { AuthController } from "../controllers/_.exporter";
import { MulterProvider } from "../../modules/_.loader";

const authRouter: Router = Router();
authRouter.post(
    "/signup",
    formDataFilter,
    preventLoginUserGuard,
    MulterProvider.uploadSingle,
    new AuthController().signup,
);
authRouter.post("/signin", applicationXWwwFormUrlencodedFilter, preventLoginUserGuard, new AuthController().signin);
authRouter.get("/token", applicationXWwwFormUrlencodedFilter, new AuthController().publishToken);
authRouter.get(
    "/confirm-password",
    applicationJsonFilter,
    preventUnLoginUserGuard,
    new AuthController().confirmPassword,
);

export default authRouter;
