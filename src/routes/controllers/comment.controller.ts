import { RequestHandler, Request, Response, NextFunction } from "express";

import { CustomException, UnkownTypeError, ValidationException } from "../../models/_.loader";
import { CreateCommentDto } from "../../models/_.loader";
import { JoiValidator } from "../../modules/_.loader";
import { CommentService } from "../services/_.exporter";

export default class CommentController {
    private commentService: CommentService;

    constructor() {
        this.commentService = new CommentService();
    }

    public createComment: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: number = res.locals.userId;
            const recipeId: number = req.body.recipeId;

            const validator: CreateCommentDto = await new JoiValidator().validateAsync<CreateCommentDto>(
                new CreateCommentDto(req.body),
            );

            const createComment = await this.commentService.createComment(validator, userId, recipeId);

            // console.log(createComment);

            return res.end();
        } catch (err) {
            console.log(err);
        }
    };
}
