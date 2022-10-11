import * as joi from "joi";
import { ObjectSchema } from "joi";
import { ParsedQs } from "qs";

import { IBaseDto } from "../i.base.dto";
import { RequestQueryExtractor } from "../request.query.extractor";

interface IUpdateCommentDto {
    userId: number;
    nickname: string;
    commentId: number;
    comment: string;
    imageUrl: string | undefined;
    resizedUrl: string | undefined;
}

export class UpdateCommentDto extends RequestQueryExtractor<"comment"> implements IBaseDto, IUpdateCommentDto {
    userId: number;
    nickname: string;
    commentId: number;
    comment: string;
    imageUrl: string | undefined;
    resizedUrl: string | undefined;

    constructor({
        userId,
        nickname,
        commentId,
        comment,
        imageUrl,
        resizedUrl,
    }: {
        userId: number;
        nickname: string;
        commentId: number;
        comment: string;
        imageUrl: string | undefined;
        resizedUrl: string | undefined;
    }) {
        super();
        this.userId = userId;
        this.nickname = nickname;
        this.commentId = commentId;
        this.comment = comment;
        this.imageUrl = imageUrl;
        this.resizedUrl = resizedUrl ? resizedUrl.replace(/\/comment\//, `/comment-resized/`) : undefined;
    }

    getJoiInstance(): ObjectSchema<UpdateCommentDto> {
        return joi.object<UpdateCommentDto>({
            userId: joi.number().required(),
            nickname: joi.string().required(),
            commentId: joi.number().required(),
            comment: joi.string().min(1).max(150).required(),
            imageUrl: joi.string().max(255),
            resizedUrl: joi.string().max(255),
        });
    }
}
