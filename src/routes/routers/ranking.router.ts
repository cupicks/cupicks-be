import { Router } from "express";

import { RankingController } from "../controllers/_.exporter";
import { tokenMiddleware } from "../../middlewares/middlewares/_.exporter";

const rankingRouter: Router = Router();

rankingRouter.get("/weekly-recipe", tokenMiddleware, new RankingController().getWeeklyLikeRecipes);

export { rankingRouter };
