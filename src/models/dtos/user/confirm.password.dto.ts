import * as joi from "joi";
import { ParsedQs } from "qs";
import { ObjectSchema, string } from "joi";

import { IBaseDto } from "../i.base.dto";

export interface IConfirmPasswordDto {
    userId: number;
    password: string;
}

export class ConfirmPasswordDto implements IBaseDto, IConfirmPasswordDto {
    userId: number;
    password: string;

    constructor({
        password,
        userId,
    }: {
        password: string | string[] | ParsedQs | ParsedQs[] | undefined;
        userId: number;
    }) {
        this.userId = userId;
        this.password = this.validateType(password);
    }

    private validateType(value: string | string[] | ParsedQs | ParsedQs[] | undefined): string {
        if (value === undefined) throw new Error("값 누락");
        else if (typeof value === "string") return value;
        else throw new Error("값 오류");
    }

    getJoiInstance(): ObjectSchema<ConfirmPasswordDto> {
        return joi.object<ConfirmPasswordDto>({
            password: joi
                .string()
                .required()
                .trim()
                .regex(/[!@#]{1,}/)
                .regex(/[^[!@#]|[^\w\d]]|[ㄱ-ㅎㅏ-ㅣ가-힣]/)
                .min(8)
                .max(15)
                .message(
                    "password 는 8자 이상 15자 이하의 영문, 숫자 조합입니다. (특수문자 !@# 는 1개 가 반드시 포함되어야 합니다.)",
                ),
            userId: joi.number().required().min(1).message("userId 는 1 이상 인 숫자이여야 합니다."),
        });
    }
}
