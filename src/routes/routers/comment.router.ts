import { Router } from "express";

import { CommentController } from "../controllers/_.exporter";
import { formDataFilter } from "../../middlewares/filters/_.exporter";
import { MulterProvider } from "../../modules/_.loader";
import { preventUnLoginUserGuard } from "../../middlewares/guards/_.exporter";

const commentRouter: Router = Router();

commentRouter.post(
    "/",
    formDataFilter,
    preventUnLoginUserGuard,
    MulterProvider.uploadNone,
    new CommentController().createComment,
);

export default commentRouter;
