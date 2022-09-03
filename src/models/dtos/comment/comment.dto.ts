import * as joi from "joi";
import { ObjectSchema } from "joi";

import { IBaseDto } from "../i.base.dto";

export class CreateCommentDto implements IBaseDto {
    comment: string;

    constructor(comment: string) {
        this.comment = comment;
    }

    getJoiInstance(): ObjectSchema<CreateCommentDto> {
        return joi.object<CreateCommentDto>({
            comment: joi.string().min(1).max(150).required(),
        });
    }
}
