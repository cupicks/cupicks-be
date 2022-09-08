import * as joi from "joi";
import { ObjectSchema } from "joi";
import { ParsedQs } from "qs";

import { IBaseDto } from "../i.base.dto";

export class CommonRecipeDto implements IBaseDto {
    recipeId: number;

    constructor({ recipeId }: { recipeId: number }) {
        this.recipeId = recipeId;
    }

    getJoiInstance(): ObjectSchema<CommonRecipeDto> {
        return joi.object<CommonRecipeDto>({
            recipeId: joi.number().min(1).required(),
        });
    }
}
