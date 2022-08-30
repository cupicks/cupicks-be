import * as joi from "joi";
import { ObjectSchema } from "joi";

import { IIngredientList, IngredientList } from "./ingredient.dto";

import { IBaseDto } from "../i.base.dto";

export interface ICreateRecipeDto {
    title: string;
    content: string;
    isIced: boolean;
    cupSize: number;
    ingredientList: IngredientList[];
}

export class CreateRecipeDto implements IBaseDto {
    title: string;
    content: string;
    isIced: boolean;
    cupSize: number;
    ingredientList: IngredientList[];

    constructor({ title, content, isIced, cupSize, ingredientList }: ICreateRecipeDto) {
        this.title = title;
        this.content = content;
        this.isIced = isIced;
        this.cupSize = cupSize;
        this.ingredientList = ingredientList;

        // 클래스가 아닙니다.
    }

    getJoiInstance(): ObjectSchema<CreateRecipeDto> {
        return joi.object<CreateRecipeDto>({});
    }
}
