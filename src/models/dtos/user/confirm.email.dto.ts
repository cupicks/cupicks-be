import * as joi from "joi";
import { ParsedQs } from "qs";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";

export interface IConfirmEmailDto {
    email: string;
    emailVerifyCode: number;
}

export class ConfirmEmailDto implements IBaseDto, IConfirmEmailDto {
    email: string;
    emailVerifyCode: number;

    constructor({
        email,
        emailVerifyCode,
    }: {
        email: string | string[] | ParsedQs | ParsedQs[] | undefined;
        emailVerifyCode: string | string[] | ParsedQs | ParsedQs[] | undefined;
    }) {
        this.email = this.validateType(email);
        this.emailVerifyCode = +this.validateType(emailVerifyCode);
    }

    private validateType(value: string | string[] | ParsedQs | ParsedQs[] | undefined): string {
        if (value === undefined) throw new Error("값 누락");
        else if (typeof value === "string") return value;
        else throw new Error("값 오류");
    }

    getJoiInstance(): ObjectSchema<ConfirmEmailDto> {
        return joi.object<ConfirmEmailDto>({
            email: joi.string().required().trim().max(100).email().message("email 은 20자 이하여야 합니다."),
            emailVerifyCode: joi.number().required().max(999999).message("email 은 20자 이하여야 합니다."),
        });
    }
}
