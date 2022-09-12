import * as joi from "joi";
import { ObjectSchema } from "joi";
import { ParsedQs } from "qs";

import { IBaseDto } from "../i.base.dto";
import { RequestQueryExtractor } from "../request.query.extractor";

export class GetCommentDto implements IBaseDto {
    recipeId: number;
    page: number;
    count: number;

    constructor({ recipeId, page, count }: { recipeId: number; page: number; count: number }) {
        this.recipeId = recipeId;
        this.page = page;
        this.count = count;
    }

    getJoiInstance(): ObjectSchema<GetCommentDto> {
        return joi.object<GetCommentDto>({
            recipeId: joi.number().min(1).required(),
            page: joi.number().min(0).required(),
            count: joi.number().min(1).required(),
        });
    }
}
