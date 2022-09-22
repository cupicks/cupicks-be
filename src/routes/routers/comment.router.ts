import { Router } from "express";

import { CommentController } from "../controllers/_.exporter";
import { formDataFilter, applicationJsonFilter } from "../../middlewares/filters/_.exporter";
import { preventUnLoginUserGuard } from "../../middlewares/guards/_.exporter";
import { multerMiddlewareForProfile, multerMiddlewareForComment } from "../../middlewares/middlewares/_.exporter";

const commentRouter: Router = Router();

commentRouter.get("/", /** applicationJsonFilter, */ new CommentController().getComments);

commentRouter.post(
    "/",
    /** formDataFilter */
    preventUnLoginUserGuard,
    multerMiddlewareForComment,
    new CommentController().createComment,
);

commentRouter.delete(
    "/:commentId",
    /** applicationJsonFilter, */
    preventUnLoginUserGuard,
    new CommentController().deleteComment,
);

commentRouter.put(
    "/:commentId",
    /** formDataFilter, */
    preventUnLoginUserGuard,
    multerMiddlewareForComment,
    new CommentController().updateComment,
);

export default commentRouter;
