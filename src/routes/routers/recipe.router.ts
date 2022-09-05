import { Router } from "express";

import { RecipeController } from "../controllers/_.exporter";
import { applicationJsonFilter } from "../../middlewares/filters/_.exporter";
import { preventUnLoginUserGuard } from "../../middlewares/guards/_.exporter";

const recipeRouter: Router = Router();

recipeRouter.post(
    "/",
    applicationJsonFilter,
    // preventUnLoginUserGuard,
    new RecipeController().createRecipe,
);

recipeRouter.get("/", applicationJsonFilter, new RecipeController().getRecipes);

recipeRouter.delete(
    "/:recipeId",
    applicationJsonFilter,
    // preventUnLoginUserGuard,
    new RecipeController().deleteRecipe,
);

export default recipeRouter;
