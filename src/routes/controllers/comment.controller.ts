import { RequestHandler, Request, Response } from "express";

import { DtoFactory } from "../../modules/_.loader";

import { CustomException, UnkownTypeError, UnkownError } from "../../models/_.loader";
import {
    CreateCommentDto,
    DeleteCommentDto,
    UpdateCommentDto,
    GetCommentDto,
    ICommentPacket,
} from "../../models/_.loader";

import { JoiValidator } from "../../modules/_.loader";
import { CommentService } from "../services/_.exporter";
import { ICommentResponse } from "../../constants/_.loader";

export class CommentController {
    private commentService: CommentService;

    constructor() {
        this.commentService = new CommentService();
    }
    // Create

    public createComment: RequestHandler = async (req: Request, res: Response) => {
        try {
            const file = req.file as Express.MulterS3.File;

            const validator: CreateCommentDto = await new JoiValidator().validateAsync<CreateCommentDto>(
                new CreateCommentDto({
                    userId: res.locals.userId,
                    nickname: res.locals.nickname,
                    recipeId: req.query.recipeId,
                    comment: req.query.comment,
                    imageUrl: file?.location,
                    resizedUrl: file?.location,
                }),
            );

            const createComment: ICommentResponse = await this.commentService.createComment(validator);

            return res.status(201).json({
                isSuccess: false,
                message: "댓글 작성에 성공하였습니다.",
                comment: {
                    userId: validator.userId,
                    nickname: validator.nickname,
                    recipeId: validator.recipeId,
                    commentId: createComment.commentId,
                    imageUrl: validator.imageUrl ? validator.imageUrl : null,
                    resizedUrl: validator.resizedUrl ? validator.resizedUrl : null,
                    createdAt: createComment.createdAt,
                    updatedAt: createComment.updatedAt,
                },
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
            const validator = await new JoiValidator().validateAsync<GetCommentDto>(
                new GetCommentDto({
                    recipeId: Number(req.query.recipeId),
                    page: Number(req.query.page),
                    count: Number(req.query.count),
                }),
            );

            const getComments: ICommentPacket[] = await this.commentService.getComments(validator);

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

            const validator: UpdateCommentDto = await new JoiValidator().validateAsync<UpdateCommentDto>(
                new UpdateCommentDto({
                    userId: res.locals.userId,
                    nickname: res.locals.nickname,
                    commentId: Number(req.params.commentId),
                    comment: req.query.comment,
                    imageUrl: file?.location,
                    resizedUrl: file?.location,
                }),
            );

            const updateComment: ICommentPacket[] = await this.commentService.updateComment(validator);

            return res.status(200).json({
                isSuccess: true,
                message: "댓글 수정에 성공하였습니다.",
                comment: {
                    userId: validator.userId,
                    nickname: validator.nickname,
                    commentId: updateComment[0].commentId,
                    imageUrl: updateComment[0].image_url,
                    resizedUrl: null,
                    comment: updateComment[0].comment,
                    createdAt: updateComment[0].createdAt,
                    updatedAt: updateComment[0].updatedAt,
                },
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
            const validator: DeleteCommentDto = await new JoiValidator().validateAsync<DeleteCommentDto>(
                new DeleteCommentDto({
                    userId: res.locals.userId,
                    commentId: Number(req.params.commentId),
                }),
            );

            await this.commentService.deleteComment(validator);

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
