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
        return joi.object<CreateRecipeDto>({});
    }
}
