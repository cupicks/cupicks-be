import * as joi from "joi";
import { ParsedQs } from "qs";
import { ObjectSchema, string } from "joi";

import { IBaseDto } from "../i.base.dto";

export interface IPublishTokenDto {
    refreshToken: string;
}

export class PublishTokenDto implements IBaseDto, IPublishTokenDto {
    refreshToken: string;

    constructor(refreshToken: string | string[] | ParsedQs | ParsedQs[] | undefined) {
        this.refreshToken = this.validateType(refreshToken);
    }

    private validateType(value: string | string[] | ParsedQs | ParsedQs[] | undefined): string {
        if (value === undefined) throw new Error("값 누락");
        else if (typeof value === "string") return value;
        else throw new Error("값 오류");
    }

    getJoiInstance(): ObjectSchema<PublishTokenDto> {
        return joi.object<PublishTokenDto>({
            refreshToken: joi.string().trim().required(),
        });
    }
}
