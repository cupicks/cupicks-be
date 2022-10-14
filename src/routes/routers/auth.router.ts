import { Router } from "express";
import { AuthController } from "../controllers/_.exporter";
import { multerMiddlewareForProfile } from "../../middlewares/middlewares/_.exporter";

const authRouter: Router = Router();
authRouter.post("/signup", multerMiddlewareForProfile, new AuthController().signup);
authRouter.post("/signin", new AuthController().signin);

authRouter.patch("/logout", new AuthController().logout);

authRouter.get("/token", new AuthController().publishToken);

authRouter.patch("/send-email", new AuthController().sendEmail);

authRouter.patch("/confirm-email", new AuthController().confirmEmailCode);

authRouter.patch("/confirm-nickname", new AuthController().confirmNickname);

authRouter.patch("/send-password", new AuthController().sendPassword);

authRouter.patch("/reset-password", new AuthController().resetPassword);

export { authRouter };
