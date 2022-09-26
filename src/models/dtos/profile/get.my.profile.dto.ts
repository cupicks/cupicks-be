import * as joi from "joi";
import { ParsedQs } from "qs";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";
import { RequestQueryExtractor } from "../request.query.extractor";

export interface IGetMyProfileDto {
    userId: number;
}

export class GetMyProfileDto extends RequestQueryExtractor<string> implements IBaseDto, IGetMyProfileDto {
    userId: number;

    constructor({ userId }: { userId: number }) {
        super();
        this.userId = userId;
    }

    getJoiInstance(): ObjectSchema<GetMyProfileDto> {
        return joi.object<GetMyProfileDto>({
            userId: joi.number().required().min(1).message("userId 는 1 이상의 숫자 여야 합니다."),
        });
    }
}
