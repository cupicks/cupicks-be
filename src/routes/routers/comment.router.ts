import { Router } from "express";

import { CommentController } from "../controllers/_.exporter";
import { preventUnLoginUserGuard } from "../../middlewares/guards/_.exporter";
import { multerMiddlewareForComment } from "../../middlewares/middlewares/_.exporter";

const commentRouter: Router = Router();

commentRouter.get("/", new CommentController().getComments);

commentRouter.post("/", preventUnLoginUserGuard, multerMiddlewareForComment, new CommentController().createComment);

commentRouter.delete("/:commentId", preventUnLoginUserGuard, new CommentController().deleteComment);

commentRouter.put(
    "/:commentId",
    preventUnLoginUserGuard,
    multerMiddlewareForComment,
    new CommentController().updateComment,
);

export { commentRouter };
