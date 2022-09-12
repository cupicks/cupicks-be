import * as joi from "joi";
import { ParsedQs } from "qs";
import { ObjectSchema } from "joi";

import { RequestQueryExtractor } from "../request.query.extractor";

import { IBaseDto } from "../i.base.dto";

export interface IResetPasswordDto {
    resetPasswordToken: string;
}
export class ResetPasswordDto
    extends RequestQueryExtractor<"resetPasswordToken">
    implements IBaseDto, IResetPasswordDto
{
    resetPasswordToken: string;

    constructor({ resetPasswordToken }: { resetPasswordToken: string | string[] | ParsedQs | ParsedQs[] | undefined }) {
        super();

        this.resetPasswordToken = this.validateType(resetPasswordToken, "resetPasswordToken");
    }

    getJoiInstance(): ObjectSchema<ResetPasswordDto> {
        return joi.object<ResetPasswordDto>({
            resetPasswordToken: joi
                .string()
                .required()
                .trim()
                .message("비밀번호 재발급 토큰 토큰은 반드시 포함되어야 합니다."),
        });
    }
}
