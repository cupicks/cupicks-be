import { RowDataPacket } from "mysql2/promise";

interface IRecipeResponse extends RowDataPacket {
    user_like_recipe_id: number;
    user_id: number;
    recipe_id: number;
}

interface IRecipeIngredient {
    recipeId: number;
    title: string;
    content: string;
    isIced: boolean;
    cupSize: string;
    createdAt: string;
    updatedAt: string;
    ingredientName: string;
    ingredientColor: string;
    ingredientAmount: string;
}

export interface IRecipeResponseCustom extends Array<IRecipeResponse> {}

export interface IRecipeIngredientCustom extends Array<IRecipeIngredient> {}
