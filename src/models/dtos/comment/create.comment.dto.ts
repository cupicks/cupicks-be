import * as joi from "joi";
import { ObjectSchema } from "joi";
import { ParsedQs } from "qs";

import { IBaseDto } from "../i.base.dto";
import { RequestQueryExtractor } from "../request.query.extractor";

interface ICreateComment {
    userId: number;
    nickname: string;
    recipeId: number;
    comment: string;
}

export class CreateCommentDto
    extends RequestQueryExtractor<"recipeId" | "comment">
    implements IBaseDto, ICreateComment
{
    userId: number;
    nickname: string;
    recipeId: number;
    comment: string;

    constructor({
        userId,
        nickname,
        recipeId,
        comment,
    }: {
        userId: number;
        nickname: string;
        recipeId: string | string[] | ParsedQs | ParsedQs[] | undefined;
        comment: string | string[] | ParsedQs | ParsedQs[] | undefined;
    }) {
        super();
        this.userId = userId;
        this.nickname = nickname;
        this.recipeId = +this.validateType(recipeId, "recipeId");
        this.comment = this.validateType(comment, "comment");
    }

    getJoiInstance(): ObjectSchema<CreateCommentDto> {
        return joi.object<CreateCommentDto>({
            userId: joi.number().min(1).required(),
            nickname: joi.string().required(),
            recipeId: joi.number().required(),
            comment: joi.string().min(1).max(150).required(),
        });
    }
}
