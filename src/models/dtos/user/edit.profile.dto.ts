import * as joi from "joi";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";

export interface IEditProfileDto {
    userId: number;
    nickname?: string;
    password?: string;
    imageUrl?: string;
}

export class EditProfileDto implements IBaseDto, IEditProfileDto {
    userId: number;
    nickname?: string | undefined;
    password?: string | undefined;
    imageUrl?: string | undefined;

    constructor({ userId, nickname, password, imageUrl }: IEditProfileDto) {
        this.userId = userId;
        this.nickname = nickname;
        this.password = password;
        this.imageUrl = imageUrl;
    }

    getJoiInstance(): ObjectSchema<EditProfileDto> {
        return joi.object<EditProfileDto>({
            userId: joi.number().required().min(1).message("userId 는 1 이상의 숫자 여야 합니다."),
            nickname: joi
                .string()
                .required()
                .trim()
                .regex(/[가-힣\w\d]/)
                .min(2)
                .max(10)
                .message(
                    "nickname 은 2자 이상 10자 이하의 한글, 영문, 숫자 조합입니다. (단모음, 단자음, 특수문자 제외)",
                ),
            password: joi
                .string()
                .trim()
                .regex(/[!@#]{1,}/)
                .regex(/[^[!@#]|[^\w\d]]|[ㄱ-ㅎㅏ-ㅣ가-힣]/)
                .min(8)
                .max(15)
                .message(
                    "password 는 8자 이상 15자 이하의 영문, 숫자 조합입니다. (특수문자 !@# 는 1개 가 반드시 포함되어야 합니다.)",
                ),
            imageUrl: joi.string().max(255).message("imageUrl 은 255 자 이하여야 합니다."),
        });
    }
}
