import * as joi from "joi";
import { ParsedQs } from "qs";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";
import { RequestQueryExtractor } from "../request.query.extractor";

export interface IConfirmNicknameDto {
    email: string;
    nickname: string;
}

export class ConfirmNicknameDto
    extends RequestQueryExtractor<"email" | "nickname">
    implements IBaseDto, IConfirmNicknameDto
{
    email: string;
    nickname: string;

    constructor({
        email,
        nickname,
    }: {
        email: string | string[] | ParsedQs | ParsedQs[] | undefined;
        nickname: string | string[] | ParsedQs | ParsedQs[] | undefined;
    }) {
        super();
        this.email = this.validateType(email, "email");
        this.nickname = this.validateType(nickname, "nickname");
    }

    getJoiInstance(): ObjectSchema<ConfirmNicknameDto> {
        return joi.object<ConfirmNicknameDto>({
            email: joi.string().required().trim().max(100).email().message("email 은 20자 이하여야 합니다."),
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
