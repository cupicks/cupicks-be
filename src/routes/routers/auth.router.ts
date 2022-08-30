import { Router } from "express";
import { AuthController } from "../controllers/_.exporter";

const authRouter: Router = Router();
authRouter.post("/signup", new AuthController().createUser);
authRouter.post("/signin", new AuthController().signin);

export default authRouter;
