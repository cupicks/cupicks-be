import * as joi from "joi";
import { ObjectSchema } from "joi";

import { IIngredientDto, IngredientDto } from "./ingredient.dto";

import { IBaseDto } from "../i.base.dto";

export interface ICreateRecipeDto {
    title: string;
    content: string;
    isIced: boolean;
    cupSize: number;
    ingredientList: IngredientDto[];
}

export class CreateRecipeDto implements IBaseDto {
    title: string;
    content: string;
    isIced: boolean;
    cupSize: number;
    ingredientList: IngredientDto[];

    constructor({ title, content, isIced, cupSize, ingredientList = [] }: ICreateRecipeDto) {
        this.title = title;
        this.content = content;
        this.isIced = isIced;
        this.cupSize = cupSize;
        this.ingredientList = ingredientList.map((ingredient) => new IngredientDto(ingredient));

        // 클래스가 아닙니다.
    }

    getJoiInstance(): ObjectSchema<CreateRecipeDto> {
        return joi.object<CreateRecipeDto>({
            title: joi.string().trim().min(2).max(20).required(),
            content: joi.string().trim().max(255).required(),
            isIced: joi.boolean().required(),
            cupSize: joi.number().equal(355, 473, 591).required(),
            ingredientList: joi.array().items(
                joi.object({
                    ingredientName: joi.string().trim().min(1).max(20).required(),
                    ingredientColor: joi
                        .string()
                        .trim()
                        .min(7)
                        .max(7)
                        .required()
                        .custom((value, helper) => {
                            if (!value.startsWith("#")) {
                                throw new Error("색상은 #으로 시작합니다.");
                            }
                        }),
                    ingredientAmount: joi.number().max(1000).required(),
                }),
            ),
        });
    }
}
