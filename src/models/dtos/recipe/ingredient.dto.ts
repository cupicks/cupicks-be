export interface IIngredientList {
    ingredientName: string;
    ingredientColor: string;
    ingredientAmount: number;
}

// 서버 ㅡ> 클래스 !== 인터페이스
// 안정적인 이유
export class IngredientList implements IIngredientList {
    ingredientName: string;
    ingredientColor: string;
    ingredientAmount: number;

    constructor({ ingredientName, ingredientColor, ingredientAmount }: IIngredientList) {
        this.ingredientName = ingredientName;
        this.ingredientColor = ingredientColor;
        this.ingredientAmount = ingredientAmount;
    }
}
