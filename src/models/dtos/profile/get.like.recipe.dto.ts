import * as joi from "joi";
import { ParsedQs } from "qs";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";
import { RequestQueryExtractor } from "../request.query.extractor";

export interface IGetLikeRecipeDto {
    userId: number;
    page: number;
    count: number;
}

export class GetLikeRecipeDto extends RequestQueryExtractor<"page" | "count"> implements IBaseDto, IGetLikeRecipeDto {
    userId: number;
    page: number;
    count: number;

    constructor({
        userId,
        page,
        count,
    }: {
        userId: number;
        page: string | string[] | ParsedQs | ParsedQs[] | undefined;
        count: string | string[] | ParsedQs | ParsedQs[] | undefined;
    }) {
        super();
        this.userId = userId;
        this.page = +this.validateType(page, "page");
        this.count = +this.validateType(count, "count");
    }

    getJoiInstance(): ObjectSchema<GetLikeRecipeDto> {
        return joi.object<GetLikeRecipeDto>({
            userId: joi.number().required().min(1).message("userId 는 1 이상의 숫자 여야 합니다."),

            page: joi.number().min(1).required(),
            count: joi.number().min(1).required(),
        });
    }
}
