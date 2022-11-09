import { Router } from "express";

import { BadgeController } from "../controllers/_.exporter";
import { preventUnLoginUserGuard } from "../../middlewares/guards/_.exporter";

const badgeRouter: Router = Router();

badgeRouter.get("", preventUnLoginUserGuard, new BadgeController().getBedgeList);

export { badgeRouter };
