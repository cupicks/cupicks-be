import { Router } from "express";

import { CommentController } from "../controllers/_.exporter";
import { formDataFilter, applicationJsonFilter } from "../../middlewares/filters/_.exporter";
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

commentRouter.delete(
    "/:commentId",
    applicationJsonFilter,
    preventUnLoginUserGuard,
    new CommentController().deleteComment,
);

commentRouter.put("/:commentId", formDataFilter, new CommentController().updateComment);

export default commentRouter;
