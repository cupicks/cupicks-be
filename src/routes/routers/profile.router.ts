import { Router } from "express";
import { preventUnLoginUserGuard } from "../../middlewares/guards/_.exporter";
import { multerMiddlewareForProfile } from "../../middlewares/middlewares/_.exporter";

import { ProfileController } from "../controllers/_.exporter";

const profileRouter: Router = Router();

profileRouter.patch("", preventUnLoginUserGuard, multerMiddlewareForProfile, new ProfileController().editProfile);

profileRouter.get("/my-profile", preventUnLoginUserGuard, new ProfileController().getMyProfile);
profileRouter.get("/my-recipe", preventUnLoginUserGuard, new ProfileController().getMyRecipe);
profileRouter.get("/like-recipe", preventUnLoginUserGuard, new ProfileController().getLikeRecipe);

export { profileRouter };
