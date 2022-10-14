import { RequestHandler, Request, Response } from "express";

// Module Dependencies

import { CommentService } from "../services/_.exporter";
import { DtoFactory } from "../../modules/_.loader";

// Dtos

import {
    CreateCommentDto,
    UpdateCommentDto,
    CustomException,
    UnkownTypeError,
    UnkownError,
} from "../../models/_.loader";

export class CommentController {
    private commentService: CommentService;
    private dtoFactory: DtoFactory;

    constructor() {
        this.commentService = new CommentService();
        this.dtoFactory = new DtoFactory();
    }
    // Create

    public createComment: RequestHandler = async (req: Request, res: Response) => {
        try {
            const file = req.file as Express.MulterS3.File;

            const createCommentValidator: CreateCommentDto = await this.dtoFactory.getCreateCommentDto({
                userId: res.locals.userId,
                nickname: res.locals.nickname,
                recipeId: req.query.recipeId,
                comment: req.body.comment,
                imageUrl: file?.location,
                resizedUrl: file?.location,
            });

            const createComment = await this.commentService.createComment(createCommentValidator);

            return res.status(201).json({
                isSuccess: false,
                message: "댓글 작성에 성공하였습니다.",
                commentList: createComment,
            });
        } catch (err) {
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
                ...exception.errorResult,
            });
        }
    };

    // Get

    public getComments: RequestHandler = async (req: Request, res: Response) => {
        try {
            const getCommentsValidator = await this.dtoFactory.getGetCommentDto({
                recipeId: Number(req.query.recipeId),
                page: Number(req.query.page),
                count: Number(req.query.count),
            });

            const getComments = await this.commentService.getComments(getCommentsValidator);

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
                errorCode: exception.errorCode,
                ...exception.errorResult,
            });
        }
    };

    // Update

    public updateComment: RequestHandler = async (req: Request, res: Response) => {
        try {
            const file = req.file as Express.MulterS3.File;

            const updateCommentValidator: UpdateCommentDto = await this.dtoFactory.getUpdateCommentDto({
                userId: res.locals.userId,
                nickname: res.locals.nickname,
                commentId: Number(req.params.commentId),
                comment: req.body.comment,
                imageUrl: file?.location,
                resizedUrl: file?.location,
            });

            const updateComment = await this.commentService.updateComment(updateCommentValidator);

            return res.status(200).json({
                isSuccess: true,
                message: "댓글 수정에 성공하였습니다.",
                comment: updateComment,
            });
        } catch (err) {
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
                ...exception.errorResult,
            });
        }
    };

    // Delete

    public deleteComment: RequestHandler = async (req: Request, res: Response) => {
        try {
            const deleteCommentValidator = await this.dtoFactory.getDeleteCommentDto({
                userId: res.locals.userId,
                commentId: Number(req.params.commentId),
            });

            await this.commentService.deleteComment(deleteCommentValidator);

            return res.status(200).json({
                isSuccess: true,
                message: "댓글 삭제에 성공하였습니다.",
            });
        } catch (err) {
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
                ...exception.errorResult,
            });
        }
    };

    public errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new UnkownError(err.message);
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };
}
