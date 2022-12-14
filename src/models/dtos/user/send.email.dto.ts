import * as joi from "joi";
import { ParsedQs } from "qs";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";
import { RequestQueryExtractor } from "../request.query.extractor";

export interface ISendEmailDto {
    email: string;
}

export class SendEmailDto extends RequestQueryExtractor<string> implements IBaseDto, ISendEmailDto {
    email: string;

    constructor({ email }: ISendEmailDto) {
        super();
        this.email = email;
    }

    getJoiInstance(): ObjectSchema<SendEmailDto> {
        return joi.object<SendEmailDto>({
            email: joi.string().required().trim().max(100).email().message("email 은 20자 이하여야 합니다."),
        });
    }
}
