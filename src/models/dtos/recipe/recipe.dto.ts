import { ObjectSchema } from "joi";
import { IBaseDto } from "../i.base.dto";
import { IIngredientDto } from "./ingredient.dto";

export interface IRecipeDto {
    recipeId: number;
    nickname: string;
    imageUrl: string;
    resizedUrl: string;
    title: string;
    content: string;
    isIced: 0 | 1;
    cupSize: string;
    createdAt: string;
    updatedAt: string;
    ingredientList: IIngredientDto[];
}

export class RecipeDto implements IRecipeDto {
    recipeId: number;
    nickname: string;
    imageUrl: string;
    resizedUrl: string;
    title: string;
    content: string;
    isIced: 0 | 1;
    cupSize: string;
    createdAt: string;
    updatedAt: string;
    ingredientList: IIngredientDto[];

    constructor({
        recipeId,
        nickname,
        imageUrl,
        resizedUrl,
        title,
        content,
        isIced,
        cupSize,
        createdAt,
        updatedAt,
        ingredientList,
    }: IRecipeDto) {
        this.recipeId = recipeId;

        this.nickname = nickname;
        this.imageUrl = imageUrl;
        this.resizedUrl = resizedUrl;

        this.title = title;
        this.content = content;
        this.isIced = isIced;
        this.cupSize = cupSize;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.ingredientList = ingredientList;
    }
}
