import { Router } from "express";

import RecipeController from "../controllers/recipe.controller";

const recipeRouter: Router = Router();

recipeRouter.post("/", new RecipeController().createPost);

export default recipeRouter;
