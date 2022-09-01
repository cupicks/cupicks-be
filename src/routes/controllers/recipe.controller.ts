import { RequestHandler, Request, Response, NextFunction } from "express";

import { CustomException, UnkownError, ValidationException } from "../../models/_.loader";
import { CreateRecipeDto } from "../../models/_.loader";
import { JoiValidator } from "../../modules/_.loader";
import { RecipeService } from "../services/_.exporter";

export default class RecipeController {
    private recipeService: RecipeService;

    constructor() {
        this.recipeService = new RecipeService();
    }

    public createRecipe: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const createRecipe = await new JoiValidator().validateAsync<CreateRecipeDto>(new CreateRecipeDto(req.body));
            for (let i = 0; i < createRecipe.ingredientList.length; i++) {
                const result = await this.recipeService.createRecipe(createRecipe);
            }
            return res.end();
        } catch (err) {
            console.log(err);
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
            });
        }
    };

    public errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new UnkownError(err.message);
        else return new ValidationException(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };
}
