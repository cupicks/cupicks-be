import * as joi from "joi";
import { ObjectSchema } from "joi";
import { ParsedQs } from "qs";

import { IBaseDto } from "../i.base.dto";
import { RequestQueryExtractor } from "../request.query.extractor";

export class DeleteCommentDto implements IBaseDto {
    userId: number;
    commentId: number;

    constructor({ userId, commentId }: { userId: number; commentId: number }) {
        this.userId = userId;
        this.commentId = commentId;
    }

    getJoiInstance(): ObjectSchema<DeleteCommentDto> {
        return joi.object<DeleteCommentDto>({
            userId: joi.number().required(),
            commentId: joi.number().required(),
        });
    }
}
