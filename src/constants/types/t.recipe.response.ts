import { RowDataPacket } from "mysql2/promise";

interface IRecipeResponse extends RowDataPacket {
    user_like_recipe_id: number;
    user_id: number;
    recipe_id: number;
}

export interface IRecipeResponseCustom extends Array<IRecipeResponse> {}
