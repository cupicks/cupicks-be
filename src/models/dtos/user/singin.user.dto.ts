import * as joi from "joi";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";

export interface ISigninUserDto {
    email: string;
    password: string;
}

export class SigninUserDto implements IBaseDto, ISigninUserDto {
    email: string;
    password: string;

    constructor({ email, password }: ISigninUserDto) {
        this.email = email;
        this.password = password;
    }

    getJoiInstance(): ObjectSchema<SigninUserDto> {
        return joi.object<SigninUserDto>({
            email: joi.string().required().trim().max(20),
            password: joi.string().required().trim().min(8).max(15),
        });
    }
}
