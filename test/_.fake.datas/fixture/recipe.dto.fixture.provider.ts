import { faker } from "@faker-js/faker";
import { ERecipeCategory } from "../../../src/models/enums/e.recipe.category";

import {
    RecipeDto,
    CreateRecipeDto,
    CommonRecipeDto,
    DeleteRecipeDto,
    GetRecipeDto,
    IngredientDto,
    UpdateRecipeDto,
} from "../../../src/models/_.loader";

// faker.lorem.word(5) // 'velit'
// faker.datatype.boolean()
// faker.datatype.number(100) // 52
// faker.helpers.arrayElements(['cat', 'dog', 'mouse']) // ['mouse', 'cat']

// milk = "milk",
// caffein = "caffein",
// lemon = "lemon",
// syrup = "syrup",

export class RecipeDtoFixtureProvider {
    public getRecipeDto({
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
        isLiked,
    }: {
        recipeId?: number;
        nickname?: string;
        imageUrl?: string;
        resizedUrl?: string;
        title?: string;
        content?: string;
        isIced?: 0 | 1;
        cupSize?: string;
        createdAt?: string;
        updatedAt?: string;
        ingredientList?: IngredientDto[];
        isLiked?: boolean;
    }): RecipeDto {
        return new RecipeDto({
            recipeId: recipeId ?? faker.datatype.number({ min: 1, max: 100 }),
            nickname: nickname ?? faker.internet.userName().substring(0, 10),
            imageUrl: imageUrl ?? faker.internet.url(),
            resizedUrl: resizedUrl ?? faker.internet.url(),
            title: title ?? faker.lorem.word(10),
            content: content ?? faker.lorem.text(),
            isIced: isIced ?? 1,
            cupSize: cupSize ?? "591",
            createdAt: createdAt ?? faker.date.recent().toString(),
            updatedAt: updatedAt ?? faker.date.recent().toString(),
            ingredientList:
                ingredientList ??
                faker.helpers.arrayElements([1]).map((): IngredientDto => {
                    return {
                        ingredientName: "오리지널 재료",
                        ingredientColor: "#FFFFFF",
                        ingredientAmount: "100",
                    };
                }),
            isLiked: isLiked ?? faker.datatype.boolean(),
        });
    }

    public getRecipesDto({
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
        isLiked,
    }: {
        recipeId?: number;
        nickname?: string;
        imageUrl?: string;
        resizedUrl?: string;
        title?: string;
        content?: string;
        isIced?: 0 | 1;
        cupSize?: string;
        createdAt?: string;
        updatedAt?: string;
        ingredientList?: IngredientDto[];
        isLiked?: boolean;
    }): RecipeDto[] {
        return [
            new RecipeDto({
                recipeId: recipeId ?? faker.datatype.number({ min: 1, max: 100 }),
                nickname: nickname ?? faker.internet.userName().substring(0, 10),
                imageUrl: imageUrl ?? faker.internet.url(),
                resizedUrl: resizedUrl ?? faker.internet.url(),
                title: title ?? faker.lorem.word(10),
                content: content ?? faker.lorem.text(),
                isIced: isIced ?? 1,
                cupSize: cupSize ?? "591",
                createdAt: createdAt ?? faker.date.recent().toString(),
                updatedAt: updatedAt ?? faker.date.recent().toString(),
                ingredientList:
                    ingredientList ??
                    faker.helpers.arrayElements([1]).map((): IngredientDto => {
                        return {
                            ingredientName: "오리지널 재료",
                            ingredientColor: "#FFFFFF",
                            ingredientAmount: "100",
                        };
                    }),
                isLiked: isLiked ?? faker.datatype.boolean(),
            }),
        ];
    }

    public getCreateRecipeDto(
        title?: string,
        content?: string,
        isIced?: boolean,
        cupSize?: string,
        isPublic?: boolean,
        ingredientList?: IngredientDto[],
        userId?: number,
        category?: ERecipeCategory[],
    ): CreateRecipeDto {
        return new CreateRecipeDto({
            title: title ?? faker.lorem.word(),
            content: content ?? faker.lorem.word(),
            isIced: isIced ?? faker.datatype.boolean(),
            cupSize: cupSize ?? "355",
            isPublic: isPublic ?? faker.datatype.boolean(),
            ingredientList:
                ingredientList ??
                faker.helpers.arrayElements([1]).map(() => {
                    return {
                        ingredientName: "재료입니다.",
                        ingredientColor: "#FFFFFF",
                        ingredientAmount: "100",
                    };
                }),
            userId: userId ?? faker.datatype.number({ min: 1, max: 100 }),
        });
    }
    // public getCreateRecipeDto(
    //     title?: string,
    //     content?: string,
    //     isIced?: boolean,
    //     cupSize?: string,
    //     isPublic?: boolean,
    //     ingredientList?: IngredientDto[],
    //     userId?: number,
    //     category?: ERecipeCategory[],
    // ): CreateRecipeDto {
    //     return new CreateRecipeDto({
    //         title: title ?? faker.lorem.word(10),
    //         content: content ?? faker.lorem.text(),
    //         isIced: isIced ?? faker.datatype.boolean(),
    //         cupSize: cupSize ?? faker.lorem.word(10),
    //         isPublic: isPublic ?? faker.datatype.boolean(),
    //         ingredientList:
    //             ingredientList ??
    //             faker.helpers.arrayElements([1]).map((): IngredientDto => {
    //                 return {
    //                     ingredientName: "오리지널 재료",
    //                     ingredientColor: "#FFFFFF",
    //                     ingredientAmount: "100",
    //                 };
    //             }),
    //         userId: userId ?? faker.datatype.number({ min: 1, max: 100 }),
    //         category: category ?? [ERecipeCategory.caffein],
    //     });
    // }

    public getGetRecipeDto(recipeId?: number, userId?: number | null): CommonRecipeDto {
        return new CommonRecipeDto({
            recipeId: recipeId ?? faker.datatype.number({ min: 1, max: 1000 }),
            userId: userId ? faker.datatype.number({ min: 1, max: 100 }) : null,
        });
    }

    public getGetRecipesDto(page?: number, count?: number, userId?: number | null): GetRecipeDto {
        return new GetRecipeDto({
            page: page ?? faker.datatype.number({ min: 1, max: 10 }),
            count: count ?? faker.datatype.number({ min: 10, max: 10 }),
            userId: userId ? faker.datatype.number({ min: 1, max: 100 }) : null,
        });
    }

    public getUpdateRecipeDto(
        title?: string,
        content?: string,
        isIced?: boolean,
        isPublic?: boolean,
        ingredientList?: IngredientDto[],
        userId?: number,
        recipeId?: number,
        category?: ERecipeCategory[],
    ): UpdateRecipeDto {
        return new UpdateRecipeDto({
            title: title ?? faker.lorem.word(10),
            content: content ?? faker.lorem.text(),
            isIced: isIced ?? faker.datatype.boolean(),
            isPublic: isPublic ?? faker.datatype.boolean(),
            ingredientList:
                ingredientList ??
                faker.helpers.arrayElements([1]).map((): IngredientDto => {
                    return {
                        ingredientName: "업데이트 재료",
                        ingredientColor: "#FFFFFF",
                        ingredientAmount: "100",
                    };
                }),
            userId: userId ?? faker.datatype.number({ min: 1, max: 100 }),
            recipeId: recipeId ?? faker.datatype.number({ min: 1, max: 100 }),
            category: category ?? [ERecipeCategory.caffein],
        });
    }

    public getDeleteRecipeDto(userId?: number, recipeId?: number): DeleteRecipeDto {
        return new DeleteRecipeDto({
            userId: userId ?? faker.datatype.number({ min: 1, max: 100 }),
            recipeId: recipeId ?? faker.datatype.number({ min: 1, max: 100 }),
        });
    }

    public getLikeRecipeDto(userId?: number, recipeId?: number): DeleteRecipeDto {
        return new DeleteRecipeDto({
            userId: userId ?? faker.datatype.number({ min: 1, max: 100 }),
            recipeId: recipeId ?? faker.datatype.number({ min: 1, max: 100 }),
        });
    }

    public getDisLikeRecipeDto(userId?: number, recipeId?: number): DeleteRecipeDto {
        return new DeleteRecipeDto({
            userId: userId ?? faker.datatype.number({ min: 1, max: 100 }),
            recipeId: recipeId ?? faker.datatype.number({ min: 1, max: 100 }),
        });
    }
}
