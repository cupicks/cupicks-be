import { RequestHandler, Request, Response, NextFunction } from "express";
import multerS3 from "multer-s3";

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
            const file = req.file as Express.MulterS3.File;

            const imageLocation = file?.location.length > 0 ? file.location : null;

            const userId: number = res.locals.userId;
            const nickname: string = res.locals.nickname;
            const recipeId: number = Number(req.query!.recipeId);
            const comment: string = req.query!.comment as string;

            const validator: CreateCommentDto = await new JoiValidator().validateAsync<CreateCommentDto>(
                new CreateCommentDto(comment),
            );

            const createComment: CreateCommentDto = await this.commentService.createComment(
                validator,
                userId,
                recipeId,
                imageLocation,
            );

            // IResponseDto??
            const responseStringify = JSON.stringify(createComment);
            const responseParse = JSON.parse(responseStringify);

            responseParse.userId = userId;
            responseParse.nickname = nickname;
            responseParse.recipeId = recipeId;
            responseParse.imageUrl = req.body.imageValue;
            responseParse.comment = req.body.comment;
            responseParse.imageUrl = imageLocation;

            return res.status(201).json({
                isSuccess: true,
                message: "댓글 작성에 성공하였습니다.",
                responseParse,
            });
        } catch (err) {
            console.log(err);
        }
    };
}
