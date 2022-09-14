import { Router } from "express";
// import { applicationJsonFilter, formDataFilter } from "../../middlewares/filters/_.exporter";
import { MulterProvider } from "../../modules/_.loader";
import { preventUnLoginUserGuard } from "../../middlewares/guards/_.exporter";
import ProfileController from "../controllers/profile.controller";

const profileRotuer: Router = Router();

profileRotuer.get("", /* applicationJsonFilter */ new ProfileController().getAllProfilesTemp);
profileRotuer.patch(
    "",
    /* formDataFilter */
    preventUnLoginUserGuard,
    MulterProvider.uploadImageProfile,
    new ProfileController().editProfile,
);

export default profileRotuer;
