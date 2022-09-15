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
    imageUrl: string | undefined;
    resizedUrl: string | undefined;
}

export class CreateCommentDto
    extends RequestQueryExtractor<"recipeId" | "comment">
    implements IBaseDto, ICreateComment
{
    userId: number;
    nickname: string;
    recipeId: number;
    comment: string;
    imageUrl: string | undefined;
    resizedUrl: string | undefined;

    constructor({
        userId,
        nickname,
        recipeId,
        comment,
        imageUrl,
        resizedUrl,
    }: {
        userId: number;
        nickname: string;
        recipeId: string | string[] | ParsedQs | ParsedQs[] | undefined;
        comment: string | string[] | ParsedQs | ParsedQs[] | undefined;
        imageUrl: string | undefined;
        resizedUrl: string | undefined;
    }) {
        super();
        this.userId = userId;
        this.nickname = nickname;
        this.recipeId = +this.validateType(recipeId, "recipeId");
        this.comment = this.validateType(comment, "comment");

        this.imageUrl = imageUrl;
        this.resizedUrl = resizedUrl ? resizedUrl.replace(/\/comment\//, `/comment-resized/`) : undefined;
    }

    getJoiInstance(): ObjectSchema<CreateCommentDto> {
        return joi.object<CreateCommentDto>({
            userId: joi.number().min(1).required(),
            nickname: joi.string().required(),
            recipeId: joi.number().required(),
            comment: joi.string().min(1).max(150).required(),
            imageUrl: joi.string().max(255),
            resizedUrl: joi.string().max(255),
        });
    }
}
