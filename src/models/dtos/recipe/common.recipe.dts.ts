import * as joi from "joi";
import { ObjectSchema } from "joi";
import { ParsedQs } from "qs";

import { IBaseDto } from "../i.base.dto";

export class CommonRecipeDto implements IBaseDto {
    recipeId: number;
    userId?: number | null;

    constructor({ recipeId, userId }: { recipeId: number; userId?: number | null }) {
        this.recipeId = recipeId;
        this.userId = userId === undefined ? null : userId;
    }

    getJoiInstance(): ObjectSchema<CommonRecipeDto> {
        return joi.object<CommonRecipeDto>({
            recipeId: joi.number().min(1).required(),
            userId: joi.number().allow(null).required(),
        });
    }
}
