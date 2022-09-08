import * as joi from "joi";
import { ObjectSchema } from "joi";
import { ParsedQs } from "qs";

import { IBaseDto } from "../i.base.dto";
import { RequestQueryExtractor } from "../request.query.extractor";

interface ICreateComment {
    userId: number;
    recipeId: number;
}

export class DeleteRecipeDto implements IBaseDto, ICreateComment {
    userId: number;
    recipeId: number;

    constructor({ userId, recipeId }: { userId: number; recipeId: number }) {
        this.userId = userId;
        this.recipeId = recipeId;
    }

    getJoiInstance(): ObjectSchema<DeleteRecipeDto> {
        return joi.object<DeleteRecipeDto>({
            userId: joi.number().min(1).required(),
            recipeId: joi.number().min(1).required(),
        });
    }
}
