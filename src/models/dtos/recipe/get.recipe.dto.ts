import * as joi from "joi";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";

interface IGetRecipeDto {
    page: number;
    count: number;
    userId: number | null;
}

export class GetRecipeDto implements IBaseDto, IGetRecipeDto {
    page: number;
    count: number;
    userId: number | null;

    constructor({ page, count, userId }: { page: number; count: number; userId: number | null }) {
        this.page = page;
        this.count = count;
        this.userId = userId === undefined ? null : userId;
    }

    getJoiInstance(): ObjectSchema<GetRecipeDto> {
        return joi.object<GetRecipeDto>({
            page: joi.number().min(1).required(),
            count: joi.number().min(1).required(),
            userId: joi.number().allow(null).required(),
        });
    }
}
