import { Router } from "express";
import { preventLoginUserGuard, preventUnLoginUserGuard } from "../../middlewares/guards/_.exporter";
// import {
//     applicationJsonFilter,
//     applicationXWwwFormUrlencodedFilter,
//     formDataFilter,
// } from "../../middlewares/filters/_.exporter";
import { AuthController } from "../controllers/_.exporter";
import { MulterProvider } from "../../modules/_.loader";
import { multerMiddlewareForProfile } from "../../middlewares/multer.middleware";

const authRouter: Router = Router();
authRouter.post(
    "/signup",
    /* formDataFilter */
    preventLoginUserGuard,
    /**
     * 1주차 기술 피드백 - https://github.com/cupicks/cupicks-be/issues/51
     *
     * 이 자리에 유저가 존재하는지 확인하는 미들웨어를 만들어 봅시다.
     */
    multerMiddlewareForProfile,
    new AuthController().signup,
);
authRouter.post(
    "/signin",
    /* applicationXWwwFormUrlencodedFilter */ preventLoginUserGuard,
    new AuthController().signin,
);

authRouter.patch(
    "/logout",
    /* applicationXWwwFormUrlencodedFilter */ /** preventUnLoginUserGuard, */
    new AuthController().logout,
);

authRouter.get("/token", /* applicationXWwwFormUrlencodedFilter */ new AuthController().publishToken);

authRouter.get("/send-email", /* applicationXWwwFormUrlencodedFilter */ new AuthController().sendEmail);

authRouter.get("/confirm-email", /* applicationXWwwFormUrlencodedFilter */ new AuthController().confirmEmailCode);

authRouter.get("/confirm-nickname", /* applicationXWwwFormUrlencodedFilter */ new AuthController().confirmNickname);

authRouter.get("/send-password", /* applicationXWwwFormUrlencodedFilter */ new AuthController().sendPassword);

authRouter.get("/reset-password", /* applicationXWwwFormUrlencodedFilter */ new AuthController().resetPassword);

export default authRouter;
