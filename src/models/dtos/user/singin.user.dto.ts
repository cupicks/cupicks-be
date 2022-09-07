import * as joi from "joi";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";
import { RequestQueryExtractor } from "../request.query.extractor";

export interface ISigninUserDto {
    email: string;
    password: string;
}

export class SigninUserDto extends RequestQueryExtractor<string> implements IBaseDto, ISigninUserDto {
    email: string;
    password: string;

    constructor({ email, password }: ISigninUserDto) {
        super();
        this.email = email;
        this.password = password;
    }

    getJoiInstance(): ObjectSchema<SigninUserDto> {
        return joi.object<SigninUserDto>({
            email: joi.string().required().trim().max(100).email().message("email 은 20자 이하여야 합니다."),
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
        });
    }
}
