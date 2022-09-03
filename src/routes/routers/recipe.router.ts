import { Router } from "express";

import RecipeController from "../controllers/recipe.controller";
import { applicationJsonFilter } from "../../middlewares/filters/_.exporter";
import { MulterProvider } from "../../modules/_.loader";
import { preventUnLoginUserGuard } from "../../middlewares/guards/_.exporter";

const recipeRouter: Router = Router();

recipeRouter.post("/", applicationJsonFilter, preventUnLoginUserGuard, new RecipeController().createRecipe);
recipeRouter.get("/", applicationJsonFilter, new RecipeController().getRecipes);

export default recipeRouter;
