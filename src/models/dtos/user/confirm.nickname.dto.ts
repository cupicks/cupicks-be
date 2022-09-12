import * as joi from "joi";
import { ParsedQs } from "qs";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";
import { RequestQueryExtractor } from "../request.query.extractor";

export interface IConfirmNicknameDto {
    emailVerifyToken: string;
    nickname: string;
}

export class ConfirmNicknameDto
    extends RequestQueryExtractor<"emailVerifyToken" | "nickname">
    implements IBaseDto, IConfirmNicknameDto
{
    emailVerifyToken: string;
    nickname: string;

    constructor({
        emailVerifyToken,
        nickname,
    }: {
        emailVerifyToken: string | string[] | ParsedQs | ParsedQs[] | undefined;
        nickname: string | string[] | ParsedQs | ParsedQs[] | undefined;
    }) {
        super();
        this.emailVerifyToken = this.validateType(emailVerifyToken, "emailVerifyToken");
        this.nickname = this.validateType(nickname, "nickname");
    }

    getJoiInstance(): ObjectSchema<ConfirmNicknameDto> {
        return joi.object<ConfirmNicknameDto>({
            emailVerifyToken: joi
                .string()
                .required()
                .max(1000)
                .message("NicknameVerifyToken 은 반드시 포함하여야 합니다."),
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
