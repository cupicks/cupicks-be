import * as joi from "joi";
import { ParsedQs } from "qs";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";

export interface ISendEmailDto {
    email: string;
}

export class SendEmailDto implements IBaseDto, ISendEmailDto {
    email: string;

    constructor({ email }: { email: string | string[] | ParsedQs | ParsedQs[] | undefined }) {
        this.email = this.validateType(email);
    }

    private validateType(value: string | string[] | ParsedQs | ParsedQs[] | undefined): string {
        if (value === undefined) throw new Error("값 누락");
        else if (typeof value === "string") return value;
        else throw new Error("값 오류");
    }

    getJoiInstance(): ObjectSchema<SendEmailDto> {
        return joi.object<SendEmailDto>({
            email: joi.string().required().trim().max(20).email().message("email 은 20자 이하여야 합니다."),
        });
    }
}
