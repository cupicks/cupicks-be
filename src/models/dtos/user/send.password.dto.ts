import * as joi from "joi";
import { ParsedQs } from "qs";
import { ObjectSchema } from "joi";

import { RequestQueryExtractor } from "../request.query.extractor";

import { IBaseDto } from "../i.base.dto";

export interface ISendPasswordDto {
    email: string;
}
export class SendPasswordDto extends RequestQueryExtractor<string> implements IBaseDto, ISendPasswordDto {
    email: string;

    constructor({ email }: ISendPasswordDto) {
        super();

        this.email = email;
    }

    getJoiInstance(): ObjectSchema<SendPasswordDto> {
        return joi.object<SendPasswordDto>({
            email: joi.string().required().trim().max(100).email().message("email 은 20자 이하여야 합니다."),
        });
    }
}
