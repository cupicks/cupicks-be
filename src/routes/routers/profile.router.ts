import { Router } from "express";
// import { applicationJsonFilter, formDataFilter } from "../../middlewares/filters/_.exporter";
import { MulterProvider } from "../../modules/_.loader";
import { preventUnLoginUserGuard } from "../../middlewares/guards/_.exporter";
import { multerMiddlewareForProfile } from "../../middlewares/middlewares/_.exporter";

import { ProfileController } from "../controllers/_.exporter";

const profileRouter: Router = Router();

profileRouter.get("", /* applicationJsonFilter */ new ProfileController().getAllProfilesTemp);
profileRouter.patch(
    "",
    /* formDataFilter */
    preventUnLoginUserGuard,
    multerMiddlewareForProfile,
    new ProfileController().editProfile,
);

profileRouter.get("/my-profile", preventUnLoginUserGuard, new ProfileController().getMyProfile);
profileRouter.get("/my-recipe", preventUnLoginUserGuard, new ProfileController().getMyRecipe);
profileRouter.get("/like-recipe", preventUnLoginUserGuard, new ProfileController().getLikeRecipe);

export { profileRouter };
