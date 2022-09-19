import { faker } from "@faker-js/faker";

import {
    RecipeDto,
    CommonRecipeDto,
    CreateRecipeDto,
    DeleteRecipeDto,
    GetRecipeDto,
    IngredientDto,
    UpdateRecipeDto,
} from "../../../src/models/_.loader";

export class RecipeDtoFixtureProvider {
    public getCreateRecipeDto(
        title?: string,
        content?: string,
        isIced?: boolean,
        cupSize?: number,
        isPublic?: boolean,
        ingredientList?: IngredientDto[],
        userId?: number,
    ): CreateRecipeDto {
        return new CreateRecipeDto(
            {
                title: title ?? faker.word.noun(),
                content: content ?? faker.word.noun(),
                isIced: isIced ?? faker.datatype.boolean(),
                cupSize: cupSize ?? faker.datatype.number(355),
                isPublic: isPublic ?? faker.datatype.boolean(),
                ingredientList: ingredientList ?? faker.datatype.array(3),
            },
            faker.random.numeric(5),
        );
    }

    public getRecipeDto(page?: number, count?: number): GetRecipeDto {
        return new GetRecipeDto({
            page: page ?? faker.datatype.number(1),
            count: count ?? faker.datatype.number(10),
        });
    }

    public getUpdateRecipeDto(
        title?: string,
        content?: string,
        isIced?: boolean,
        cupSize?: number,
        isPublic?: boolean,
        ingredientList?: IngredientDto[],
        userId?: number,
        recipeId?: number,
    ): UpdateRecipeDto {
        return new UpdateRecipeDto(
            {
                title: title ?? faker.word.noun(),
                content: content ?? faker.word.noun(),
                isIced: isIced ?? faker.datatype.boolean(),
                cupSize: cupSize ?? faker.datatype.number(355),
                isPublic: isPublic ?? faker.datatype.boolean(),
                ingredientList: ingredientList ?? faker.datatype.array(3),
            },
            faker.datatype.number(10),
            faker.datatype.number(55),
        );
    }

    public getDeleteRecipeDto(userId?: number, recipeId?: number): DeleteRecipeDto {
        return new DeleteRecipeDto({
            userId: userId ?? faker.datatype.number(5),
            recipeId: recipeId ?? faker.datatype.number(55),
        });
    }

    public getLikeRecipeDto(userId?: number, recipeId?: number): DeleteRecipeDto {
        return new DeleteRecipeDto({
            userId: userId ?? faker.datatype.number(5),
            recipeId: recipeId ?? faker.datatype.number(55),
        });
    }

    public getDisLikeRecipeDto(userId?: number, recipeId?: number): DeleteRecipeDto {
        return new DeleteRecipeDto({
            userId: userId ?? faker.datatype.number(5),
            recipeId: recipeId ?? faker.datatype.number(55),
        });
    }
}
