import { Router } from "express";
import { formDataFilter } from "../../middlewares/filters/_.exporter";
import { MulterProvider } from "../../modules/_.loader";
import { preventUnLoginUserGuard } from "../../middlewares/guards/_.exporter";
import ProfileController from "../controllers/profile.controller";

const profileRotuer: Router = Router();

profileRotuer.patch(
    "",
    formDataFilter,
    preventUnLoginUserGuard,
    MulterProvider.uploadSingle,
    new ProfileController().editProfile,
);

export default profileRotuer;
