import { Router } from "express";
// import { applicationJsonFilter, formDataFilter } from "../../middlewares/filters/_.exporter";
import { MulterProvider } from "../../modules/_.loader";
import { preventUnLoginUserGuard } from "../../middlewares/guards/_.exporter";
import { multerMiddlewareForProfile } from "../../middlewares/middlewares/_.exporter";

import ProfileController from "../controllers/profile.controller";

const profileRotuer: Router = Router();

profileRotuer.get("", /* applicationJsonFilter */ new ProfileController().getAllProfilesTemp);
profileRotuer.patch(
    "",
    /* formDataFilter */
    preventUnLoginUserGuard,
    multerMiddlewareForProfile,
    new ProfileController().editProfile,
);

profileRotuer.get("/my-recipe", preventUnLoginUserGuard, new ProfileController().getMyRecipe);
profileRotuer.get("/like-recipe", preventUnLoginUserGuard, new ProfileController().getLikeRecipe);

export default profileRotuer;
