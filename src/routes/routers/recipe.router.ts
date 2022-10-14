import { Router } from "express";

import { RecipeController } from "../controllers/_.exporter";
import { preventUnLoginUserGuard } from "../../middlewares/guards/_.exporter";
import { tokenMiddleware } from "../../middlewares/middlewares/_.exporter";

const recipeRouter: Router = Router();

recipeRouter.get("/", tokenMiddleware, new RecipeController().getRecipes);

recipeRouter.get("/:recipeId", tokenMiddleware, new RecipeController().getRecipe);

recipeRouter.post("/", preventUnLoginUserGuard, new RecipeController().createRecipe);

recipeRouter.put("/:recipeId", preventUnLoginUserGuard, new RecipeController().updatedRecipe);

recipeRouter.delete("/:recipeId", preventUnLoginUserGuard, new RecipeController().deleteRecipe);

recipeRouter.patch("/:recipeId/like", preventUnLoginUserGuard, new RecipeController().likeRecipe);

recipeRouter.patch("/:recipeId/dislike", preventUnLoginUserGuard, new RecipeController().disLikeRecipe);

export { recipeRouter };
