import { RequestHandler, Request, Response, NextFunction } from "express";
import multerS3 from "multer-s3";

import { CustomException, UnkownTypeError, ValidationException } from "../../models/_.loader";
import { CreateCommentDto } from "../../models/_.loader";
import { JoiValidator } from "../../modules/_.loader";
import { CommentService } from "../services/_.exporter";
import { MulterProvider } from "../../modules/_.loader";

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

            if (!recipeId && !comment) throw new Error("protected");

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
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
            });
        }
    };

    public deleteComment: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: number = Number(res.locals.userId);
            const commentId: number = Number(req.params.commentId);

            if (!commentId) throw new Error("protected");

            const deleteComment = await this.commentService.deleteComment(userId, commentId);

            if (deleteComment === "undefined") {
                throw new Error("here");
            }

            // if (userId !== isAuthenticated) {
            //     console.log(`유저 아이디 ${userId} 댓글 아이디 ${isAuthenticated}`);
            //     throw new Error("내가 작성한 댓글이 아닙니다.")
            // };

            // target = 이미지값
            // const target = "1662229682052html.jpg";
            // const result = await MulterProvider.deleteImage(target);

            return res.status(200).json({
                isSuccess: true,
                message: "댓글 삭제에 성공하였습니다.",
            });
        } catch (err) {
            console.log("캐치가 실행됩니다.");
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
            });
        }
    };

    public errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new ValidationException(err.message);
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };
}
