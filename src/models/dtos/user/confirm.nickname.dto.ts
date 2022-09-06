import * as joi from "joi";
import { ParsedQs } from "qs";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";

export interface IConfirmNicknameDto {
    nickname: string;
}

export class ConfirmNicknameDto implements IBaseDto, IConfirmNicknameDto {
    nickname: string;

    constructor({ email }: { email: string | string[] | ParsedQs | ParsedQs[] | undefined }) {
        this.nickname = this.validateType(email);
    }

    private validateType(value: string | string[] | ParsedQs | ParsedQs[] | undefined): string {
        if (value === undefined) throw new Error("값 누락");
        else if (typeof value === "string") return value;
        else throw new Error("값 오류");
    }

    getJoiInstance(): ObjectSchema<ConfirmNicknameDto> {
        return joi.object<ConfirmNicknameDto>({
            nickname: joi
                .string()
                .required()
                .trim()
                // .regex(/[[ㄱ-ㅎㅏ-ㅣ]|[^\w\d]]/)
                .min(2)
                .max(10)
                .message(
                    "nickname 은 2자 이상 10자 이하의 한글, 영문, 숫자 조합입니다. (단모음, 단자음, 특수문자 제외)",
                ),
        });
    }
}
