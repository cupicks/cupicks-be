import * as joi from "joi";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";

interface IGetRecipeDto {
    page: number;
    count: number;
}

export class GetRecipeDto implements IBaseDto, IGetRecipeDto {
    page: number;
    count: number;

    constructor({ page, count }: { page: number; count: number }) {
        this.page = page;
        this.count = count;
    }

    getJoiInstance(): ObjectSchema<GetRecipeDto> {
        return joi.object<GetRecipeDto>({
            page: joi.number().min(1).required(),
            count: joi.number().min(1).required(),
        });
    }
}
