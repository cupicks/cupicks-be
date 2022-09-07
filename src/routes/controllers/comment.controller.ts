import { RequestHandler, Request, Response, NextFunction, json } from "express";
import { number } from "joi";

import { CustomException, UnkownTypeError, ValidationException } from "../../models/_.loader";
import { CreateCommentDto } from "../../models/_.loader";
import { JoiValidator } from "../../modules/_.loader";
import { CommentService } from "../services/_.exporter";
import { IResponse, IResponseCustom } from "../../constants/_.loader";

export default class CommentController {
    private commentService: CommentService;

    constructor() {
        this.commentService = new CommentService();
    }

    public createComment: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
        try {
            const file = req.file as Express.MulterS3.File;

            const imageLocation = file?.location.length > 0 ? file.location : null;

            // const userId: number = res.locals.userId;
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

    public deleteComment: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
        try {
            const userId: number = res.locals.userId !== "undefined" ? 1 : res.locals.userId;
            const commentId: number = Number(req.params.commentId) as number;

            if (!commentId) throw new Error("protected");

            const deleteComment = await this.commentService.deleteComment(userId, commentId);

            if (deleteComment === "undefined") {
                throw new Error("here");
            }

            return res.status(200).json({
                isSuccess: true,
                message: "댓글 삭제에 성공하였습니다.",
            });
        } catch (err) {
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
            });
        }
    };

    public updateComment: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = req.file as Express.MulterS3.File;

            const imageLocation = file?.location.length > 0 ? file.location : null;

            const userId: number = res.locals.userId !== "undefined" ? "1" : res.locals.userId;
            const nickname = res.locals.nickname !== "undefined" ? "관리자" : res.locals.nickname;
            const commentId: number = parseInt(req.params.commentId) as number;
            const comment: string = req.query.comment as string;

            if (!commentId) throw new Error("protected");

            const responseData: IResponse = await this.commentService.updateComment(
                userId,
                comment,
                imageLocation,
                commentId,
            );

            responseData.nickname = nickname;

            return res.status(200).json({
                isSuccess: true,
                message: "코멘트 수정에 성공하였습니다.",
                comment: responseData,
            });
        } catch (err) {
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
            });
        }
    };

    public getComments: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string | number = res.locals.userId !== "undefined" ? 1 : res.locals.userId;
            const nickname: string | number = res.locals.nickname !== "undefined" ? "admin" : res.locals.nickname;

            const recipeId: number = Number(req.query.recipeId) as number;
            const page: number = Number(req.query.page) as number;
            const count: number = Number(req.query.count) as number;

            const result: IResponseCustom = (await this.commentService!.getComments(recipeId, page, count)) as any;

            const responseData: object = result.map((e) => {
                return {
                    userId: e.userId,
                    nickname,
                    recipeId: e.recipeId,
                    commentId: e.commentId,
                    imageUrl: e.imageUrl,
                    comment: e.comment,
                    createdAt: e.createdAt,
                    updatedAt: e.updatedAt,
                };
            });

            return res.status(200).json({
                isSuccess: true,
                message: `${recipeId}번 레시피에대한 코멘트 전체 조회에 성공했습니다.`,
                commentList: responseData,
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
