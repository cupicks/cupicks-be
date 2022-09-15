import * as joi from "joi";
import { ParsedQs } from "qs";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";
import { RequestQueryExtractor } from "../request.query.extractor";

export interface ISignupUserDto {
    password: string;
    imageUrl: string | undefined;
    resizedUrl: string | undefined;
    nicknameVerifyToken: string;
    emailVerifyToken: string;
}

export class SignupUserDto
    extends RequestQueryExtractor<"password" | "nicknameVerifyToken" | "emailVerifyToken">
    implements IBaseDto, ISignupUserDto
{
    password: string;
    imageUrl: string | undefined;
    resizedUrl: string | undefined;
    nicknameVerifyToken: string;
    emailVerifyToken: string;

    constructor({
        password,
        imageUrl,
        resizedUrl,
        nicknameVerifyToken,
        emailVerifyToken,
    }: {
        password: string | string[] | ParsedQs | ParsedQs[] | undefined;
        imageUrl: string | undefined;
        resizedUrl: string | undefined;
        nicknameVerifyToken: string | string[] | ParsedQs | ParsedQs[] | undefined;
        emailVerifyToken: string | string[] | ParsedQs | ParsedQs[] | undefined;
    }) {
        super();
        this.password = this.validateType(password, "password");

        this.imageUrl = imageUrl;
        this.resizedUrl = resizedUrl ? resizedUrl.replace(/\/profile\//, `/profile-resized/`) : undefined;

        this.nicknameVerifyToken = this.validateType(nicknameVerifyToken, "nicknameVerifyToken");
        this.emailVerifyToken = this.validateType(emailVerifyToken, "emailVerifyToken");
    }

    getJoiInstance(): ObjectSchema<SignupUserDto> {
        return joi.object<SignupUserDto>({
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
            imageUrl: joi.string().max(255).message("imageUrl 은 255 자 이하여야 합니다."),
            resizedUrl: joi.string().max(255).message("resizedUrl 은 255 자 이하여야 합니다."),
            nicknameVerifyToken: joi
                .string()
                .required()
                .max(1000)
                .message("NicknameVerifyToken 은 반드시 포함하여야 합니다."),
            emailVerifyToken: joi
                .string()
                .required()
                .max(1000)
                .message("NicknameVerifyToken 은 반드시 포함하여야 합니다."),
        });
    }
}
