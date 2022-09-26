import * as joi from "joi";
import { ObjectSchema } from "joi";

import { IngredientDto } from "./ingredient.dto";
import { ICreateRecipeDto } from "./create.recipe.dto";

import { IBaseDto } from "../i.base.dto";

import { RequestQueryExtractor } from "../request.query.extractor";

export class UpdateRecipeDto extends RequestQueryExtractor<string> implements IBaseDto {
    title: string;
    content: string;
    isIced: boolean;
    isPublic: boolean;
    ingredientList: IngredientDto[];
    userId: number;
    recipeId: number;

    constructor({
        title,
        content,
        isIced,
        isPublic,
        ingredientList = [],
        userId,
        recipeId,
    }: Omit<ICreateRecipeDto, "cupSize">) {
        super();
        this.title = title;
        this.content = content;
        this.isIced = isIced;
        this.isPublic = isPublic;
        this.ingredientList = ingredientList.map((ingredient) => new IngredientDto(ingredient));
        this.userId = userId;
        this.recipeId = +recipeId!;

        // 클래스가 아닙니다.
    }

    getJoiInstance(): ObjectSchema<UpdateRecipeDto> {
        return joi.object<UpdateRecipeDto>({
            title: joi.string().trim().min(2).max(20).required(),
            content: joi.string().trim().min(2).max(255).required(),
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
            userId: joi.number().min(1).required(),
            recipeId: joi.number().min(1).required(),
        });
    }
}
