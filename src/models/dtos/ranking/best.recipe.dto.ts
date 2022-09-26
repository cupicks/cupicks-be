import * as joi from "joi";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";

interface IBestRecipeDto {
    userId: number | null;
}

export class BestRecipeDto implements IBaseDto, IBestRecipeDto {
    userId: number | null;

    constructor({ userId }: { userId: number | null }) {
        this.userId = userId === undefined ? null : userId;
    }

    getJoiInstance(): ObjectSchema<BestRecipeDto> {
        return joi.object<BestRecipeDto>({
            userId: joi.number().allow(null).required(),
        });
    }
}
