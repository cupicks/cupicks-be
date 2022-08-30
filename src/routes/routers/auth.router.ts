import { Router } from "express";
import { AuthController } from "../controllers/_.exporter";

const authRouter: Router = Router();
authRouter.post("/signup", new AuthController().signup);
authRouter.post("/signin", new AuthController().signin);

export default authRouter;
