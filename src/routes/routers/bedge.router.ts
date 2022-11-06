import { Router } from "express";

import { BedgeController } from "../controllers/_.exporter";
import { preventUnLoginUserGuard } from "../../middlewares/guards/_.exporter";

const bedgeRouter: Router = Router();

bedgeRouter.get("", preventUnLoginUserGuard, new BedgeController().getBedgeList);

export { bedgeRouter };
