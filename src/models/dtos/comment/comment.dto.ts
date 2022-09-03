import * as joi from "joi";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";

export interface ICommentDto {
    comment: string;
    imageValue: string;
}

export class CreateCommentDto implements IBaseDto {
    comment: string;
    imageValue: string;

    constructor({ comment, imageValue }: ICommentDto) {
        this.comment = comment;
        this.imageValue = imageValue;
    }

    getJoiInstance(): ObjectSchema<CreateCommentDto> {
        return joi.object<CreateCommentDto>({
            comment: joi.string().min(1).max(150).required(),
            imageValue: joi.string().max(300),
        });
    }
}
