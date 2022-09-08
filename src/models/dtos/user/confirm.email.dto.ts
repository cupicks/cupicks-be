import * as joi from "joi";
import { ParsedQs } from "qs";
import { ObjectSchema } from "joi";

import { RequestQueryExtractor } from "../request.query.extractor";

import { IBaseDto } from "../i.base.dto";

export interface IConfirmEmailDto {
    email: string;
    emailVerifyCode: string;
}
export class ConfirmEmailDto
    extends RequestQueryExtractor<"email" | "email-verify-code">
    implements IBaseDto, IConfirmEmailDto
{
    email: string;
    emailVerifyCode: string;

    constructor({
        email,
        emailVerifyCode,
    }: {
        email: string | string[] | ParsedQs | ParsedQs[] | undefined;
        emailVerifyCode: string | string[] | ParsedQs | ParsedQs[] | undefined;
    }) {
        super();

        this.email = this.validateType(email, "email");
        this.emailVerifyCode = this.validateType(emailVerifyCode, "email-verify-code");
    }

    getJoiInstance(): ObjectSchema<ConfirmEmailDto> {
        return joi.object<ConfirmEmailDto>({
            email: joi.string().required().trim().max(100).email().message("email 은 20자 이하여야 합니다."),
            emailVerifyCode: joi.string().required().min(6).max(6).message("Verify Code 는 6자리 이여야 합니다."),
        });
    }
}
