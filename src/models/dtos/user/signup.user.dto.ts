import * as joi from "joi";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";

export interface ISignupUserDto {
    nickname: string;
    email: string;
    password: string;
    imageUrl: string | undefined;
}

export class SignupUserDto implements IBaseDto, ISignupUserDto {
    nickname: string;
    email: string;
    password: string;
    imageUrl: string | undefined;

    constructor({ nickname, email, password, imageUrl }: ISignupUserDto) {
        this.nickname = nickname;
        this.email = email;
        this.password = password;
        this.imageUrl = imageUrl;
    }

    getJoiInstance(): ObjectSchema<SignupUserDto> {
        return joi.object<SignupUserDto>({
            email: joi.string().required().trim().max(20).email().message("email 은 20자 이하여야 합니다."),
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
            imageUrl: joi.string().required().max(255).message("imageUrl 은 255 자 이하여야 합니다."),
        });
    }
}
