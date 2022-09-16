import * as joi from "joi";
import { ParsedQs } from "qs";
import { ObjectSchema, string } from "joi";

import { IBaseDto } from "../i.base.dto";
import { RequestQueryExtractor } from "../request.query.extractor";

export interface IPublishTokenDto {
    refreshToken: string;
}

export class PublishTokenDto extends RequestQueryExtractor<"refreshToken"> implements IBaseDto, IPublishTokenDto {
    refreshToken: string;

    constructor({ refreshToken }: { refreshToken: string | string[] | ParsedQs | ParsedQs[] | undefined }) {
        super();
        this.refreshToken = this.validateType(refreshToken, "refreshToken");
    }

    getJoiInstance(): ObjectSchema<PublishTokenDto> {
        return joi.object<PublishTokenDto>({
            refreshToken: joi.string().required().trim().message("리프레쉬 토큰은 반드시 포함되어야 합니다."),
        });
    }
}
