import { ERecipeCategory } from "../../../../../src/models/enums/_.exporter";

export function getRandERecipeCategory(): ERecipeCategory {
    const CATEGORY_LIST: ERecipeCategory[] = [
        ERecipeCategory.caffein,
        ERecipeCategory.milk,
        ERecipeCategory.lemon,
        ERecipeCategory.syrup,
    ];

    const randIndex = Math.floor(Math.random() * CATEGORY_LIST.length);
    return CATEGORY_LIST[randIndex];
}
