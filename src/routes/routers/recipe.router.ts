import { Router } from "express";

import RecipeController from "../controllers/recipe.controller";
import { applicationJsonFilter } from "../../middlewares/filters/_.exporter";
import { MulterProvider } from "../../modules/_.loader";
import { preventUnLoginUserGuard } from "../../middlewares/guards/_.exporter";

const recipeRouter: Router = Router();

recipeRouter.post(
    "/",
    applicationJsonFilter,
    preventUnLoginUserGuard,
    MulterProvider.uploadSingle,
    new RecipeController().createRecipe,
);

export default recipeRouter;
