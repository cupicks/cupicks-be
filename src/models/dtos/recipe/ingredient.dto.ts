export interface IIngredientDto {
    ingredientName: string;
    ingredientColor: string;
    ingredientAmount: string;
}

// 서버 ㅡ> 클래스 !== 인터페이스
// 안정적인 이유
export class IngredientDto implements IIngredientDto {
    ingredientName: string;
    ingredientColor: string;
    ingredientAmount: string;

    constructor({ ingredientName, ingredientColor, ingredientAmount }: IIngredientDto) {
        this.ingredientName = ingredientName;
        this.ingredientColor = ingredientColor;
        this.ingredientAmount = ingredientAmount;
    }
}
