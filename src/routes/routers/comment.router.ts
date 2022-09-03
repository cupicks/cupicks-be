import { Router } from "express";

import { CommentController } from "../controllers/_.exporter";
import { formDataFilter } from "../../middlewares/filters/_.exporter";
import { MulterProvider } from "../../modules/_.loader";
import { preventUnLoginUserGuard } from "../../middlewares/guards/_.exporter";
import { multerMiddleware } from "../../middlewares/multer.middleware";

const commentRouter: Router = Router();

commentRouter.post(
    "/",
    formDataFilter,
    preventUnLoginUserGuard,
    multerMiddleware,
    new CommentController().createComment,
);

commentRouter.delete("/:commentId");

export default commentRouter;
