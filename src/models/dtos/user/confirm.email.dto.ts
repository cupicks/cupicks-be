import * as joi from "joi";
import { ParsedQs } from "qs";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";

export interface IConfirmEmailDto {
    emailVerifyCode: number;
}

export class ConfirmEmailDto implements IBaseDto, IConfirmEmailDto {
    emailVerifyCode: number;

    constructor({ email }: { email: string | string[] | ParsedQs | ParsedQs[] | undefined }) {
        this.emailVerifyCode = +this.validateType(email);
    }

    private validateType(value: string | string[] | ParsedQs | ParsedQs[] | undefined): string {
        if (value === undefined) throw new Error("값 누락");
        else if (typeof value === "string") return value;
        else throw new Error("값 오류");
    }

    getJoiInstance(): ObjectSchema<ConfirmEmailDto> {
        return joi.object<ConfirmEmailDto>({
            emailVerifyCode: joi.number().required().max(999999).message("email 은 20자 이하여야 합니다."),
        });
    }
}
