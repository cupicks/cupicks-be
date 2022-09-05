import * as joi from "joi";
import { ObjectSchema } from "joi";

import { IngredientDto } from "./ingredient.dto";
import { ICreateRecipeDto } from "./create.recipe.dto";

import { IBaseDto } from "../i.base.dto";

export class UpdateRecipeDto implements IBaseDto {
    title: string;
    content: string;
    isIced: boolean;
    cupSize?: number;
    isPublic: boolean;
    ingredientList: IngredientDto[];

    constructor({ title, content, isIced, isPublic, ingredientList = [] }: Omit<ICreateRecipeDto, "cupSize">) {
        this.title = title;
        this.content = content;
        this.isIced = isIced;
        this.isPublic = isPublic;
        this.ingredientList = ingredientList.map((ingredient) => new IngredientDto(ingredient));

        // 클래스가 아닙니다.
    }

    getJoiInstance(): ObjectSchema<UpdateRecipeDto> {
        return joi.object<UpdateRecipeDto>({
            title: joi.string().trim().min(2).max(20).required(),
            content: joi.string().trim().max(255).required(),
            isIced: joi.boolean().required(),
            isPublic: joi.boolean().required(),
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
                            return value;
                        }),
                    ingredientAmount: joi.number().max(1000).required(),
                }),
            ),
        });
    }
}
