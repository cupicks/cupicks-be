import { ObjectSchema } from "joi";

export interface IBaseDto {
    getJoiInstance(): ObjectSchema;
}
