import { Router } from "express";

import RecipeController from "../controllers/recipe.controller";
import { MulterProvider } from "../../modules/_.loader";

const recipeRouter: Router = Router();

recipeRouter.post("/", MulterProvider.uploadSingle, new RecipeController().createRecipe);

export default recipeRouter;
