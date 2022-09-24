import { Router } from "express";

import { RecipeController } from "../controllers/_.exporter";
// import { applicationJsonFilter } from "../../middlewares/filters/_.exporter";
import { preventUnLoginUserGuard } from "../../middlewares/guards/_.exporter";
import { tokenMiddleware } from "../../middlewares/middlewares/_.exporter";

const recipeRouter: Router = Router();

recipeRouter.get("/", /* applicationJsonFilter */ tokenMiddleware, new RecipeController().getRecipes);

recipeRouter.get("/:recipeId", /* applicationJsonFilter */ tokenMiddleware, new RecipeController().getRecipe);

recipeRouter.post("/", /* applicationJsonFilter */ preventUnLoginUserGuard, new RecipeController().createRecipe);

recipeRouter.put(
    "/:recipeId",
    /* applicationJsonFilter */ preventUnLoginUserGuard,
    new RecipeController().updatedRecipe,
);

recipeRouter.delete(
    "/:recipeId",
    /* applicationJsonFilter */ preventUnLoginUserGuard,
    new RecipeController().deleteRecipe,
);

recipeRouter.patch(
    "/:recipeId/like",
    /* applicationJsonFilter */
    preventUnLoginUserGuard,
    new RecipeController().likeRecipe,
);

recipeRouter.patch(
    "/:recipeId/dislike",
    /* applicationJsonFilter */
    preventUnLoginUserGuard,
    new RecipeController().disLikeRecipe,
);

export default recipeRouter;
