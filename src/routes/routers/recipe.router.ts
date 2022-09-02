import { Router } from "express";

import RecipeController from "../controllers/recipe.controller";
import { formDataFilter } from "../../middlewares/filters/_.exporter";

const recipeRouter: Router = Router();

recipeRouter.post("/", new RecipeController().createRecipe);

export default recipeRouter;
