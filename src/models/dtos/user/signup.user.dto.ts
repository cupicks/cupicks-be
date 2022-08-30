import * as joi from "joi";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";

export interface ISignupUserDto {
    nickname: string;
    email: string;
    password: string;
    imageUrl: string;
}

export class SignupUserDto implements IBaseDto {
    nickname: string;
    email: string;
    password: string;
    imageUrl: string;

    constructor({ nickname, email, password, imageUrl }: ISignupUserDto) {
        this.nickname = nickname;
        this.email = email;
        this.password = password;
        this.imageUrl = imageUrl;
    }

    getJoiInstance(): ObjectSchema<SignupUserDto> {
        return joi.object<SignupUserDto>({
            email: joi.string().required().trim().max(20),
            nickname: joi.string().required().trim().min(2).max(10),
            password: joi.string().required().trim().min(8).max(15),
            imageUrl: joi.string().required().max(255),
        });
    }
}
