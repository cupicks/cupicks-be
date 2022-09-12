import { RequestHandler, Request, Response } from "express";

import { CustomException, UnkownTypeError, ValidationException } from "../../models/_.loader";
import { CreateCommentDto, DeleteCommentDto, UpdateCommentDto, GetCommentDto } from "../../models/_.loader";
import { JoiValidator } from "../../modules/_.loader";
import { CommentService } from "../services/_.exporter";
import { IRecipeResponseCustom, IResponse, IResponseCustom } from "../../constants/_.loader";

export default class CommentController {
    private commentService: CommentService;

    constructor() {
        this.commentService = new CommentService();
    }

    public createComment: RequestHandler = async (req: Request, res: Response) => {
        try {
            const file = req.file as Express.MulterS3.File;

            const imageLocation = file?.location.length > 0 ? file.location : null;

            const validator: CreateCommentDto = await new JoiValidator().validateAsync<CreateCommentDto>(
                new CreateCommentDto({
                    userId: res.locals.userId,
                    nickname: res.locals.nickname,
                    recipeId: req.query.recipeId,
                    comment: req.query.comment,
                }),
            );

            console.log(typeof validator.recipeId);

            const createComment = await this.commentService.createComment(
                validator,
                validator.userId,
                validator.recipeId,
                imageLocation,
            );

            return res.status(201).json({
                isSuccess: false,
                message: "댓글 작성에 성공하였습니다.",
                comment: {
                    userId: validator.userId,
                    nickname: validator.nickname,
                    recipeId: validator.recipeId,
                    commentId: createComment.commentId,
                    imageUrl: imageLocation,
                    resizedUrl: null,
                    createdAt: createComment.createdAt,
                    updatedAt: createComment.updatedAt,
                },
            });
        } catch (err) {
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
            });
        }
    };

    public deleteComment: RequestHandler = async (req: Request, res: Response) => {
        try {
            const validator = await new JoiValidator().validateAsync<DeleteCommentDto>(
                new DeleteCommentDto({
                    userId: res.locals.userId,
                    commentId: Number(req.params.commentId),
                }),
            );

            await this.commentService.deleteComment(validator.userId, validator.commentId);

            return res.status(200).json({
                isSuccess: true,
                message: "댓글 삭제에 성공하였습니다.",
            });
        } catch (err) {
            console.log(err);
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
            });
        }
    };

    public updateComment: RequestHandler = async (req: Request, res: Response) => {
        try {
            const file = req.file as Express.MulterS3.File;

            const imageLocation = file?.location.length > 0 ? file.location : null;

            const validator = await new JoiValidator().validateAsync<UpdateCommentDto>(
                new UpdateCommentDto({
                    userId: res.locals.userId,
                    nickname: res.locals.nickname,
                    commentId: Number(req.params.commentId),
                    comment: req.query.comment,
                }),
            );

            const updateComment = await this.commentService.updateComment(
                validator.userId,
                validator.comment,
                imageLocation,
                validator.commentId,
            );

            return res.status(200).json({
                isSuccess: true,
                message: "댓글 수정에 성공하였습니다.",
                comment: {
                    userId: validator.userId,
                    nickname: validator.nickname,
                    commentId: validator.commentId,
                    imageUrl: imageLocation,
                    resizedUrl: null,
                    comment: validator.comment,
                    createdAt: updateComment.createdAt,
                    updatedAt: updateComment.updatedAt,
                },
            });
        } catch (err) {
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
            });
        }
    };

    public getComments: RequestHandler = async (req: Request, res: Response) => {
        try {
            const validator = await new JoiValidator().validateAsync<GetCommentDto>(
                new GetCommentDto({
                    recipeId: Number(req.query.recipeId),
                    page: Number(req.query.page),
                    count: Number(req.query.count),
                }),
            );

            const getComments = await this.commentService.getComments(
                validator.recipeId,
                validator.page,
                validator.count,
            );

            return res.status(200).json({
                isSuccess: true,
                message: "댓글 전체 조회에 성공했습니다.",
                commentList: getComments,
            });
        } catch (err) {
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
