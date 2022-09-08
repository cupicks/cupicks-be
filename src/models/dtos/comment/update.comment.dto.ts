import * as joi from "joi";
import { ObjectSchema } from "joi";
import { ParsedQs } from "qs";

import { IBaseDto } from "../i.base.dto";
import { RequestQueryExtractor } from "../request.query.extractor";

export class UpdateCommentDto extends RequestQueryExtractor<"comment"> implements IBaseDto {
    userId: number;
    nickname: string;
    commentId: number;
    comment: string;

    constructor({
        userId,
        nickname,
        commentId,
        comment,
    }: {
        userId: number;
        nickname: string;
        commentId: number;
        comment: string | string[] | ParsedQs | ParsedQs[] | undefined;
    }) {
        super();
        this.userId = userId;
        this.nickname = nickname;
        this.commentId = commentId;
        this.comment = this.validateType(comment, "comment");
    }

    getJoiInstance(): ObjectSchema<UpdateCommentDto> {
        return joi.object<UpdateCommentDto>({
            userId: joi.number().required(),
            nickname: joi.string().required(),
            commentId: joi.number().required(),
            comment: joi.string().min(1).max(150).required(),
        });
    }
}
