import { RequestHandler, Request, Response, NextFunction } from "express";

import { CustomException, UnkownTypeError, ValidationException } from "../../models/_.loader";
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
            const userId = res.locals.userId;

            const validator = await new JoiValidator().validateAsync<CreateRecipeDto>(new CreateRecipeDto(req.body));

            const createRecipe = await this.recipeService.createRecipe(validator, userId);

            return res.status(201).json({
                isSuccess: true,
                message: "레시피 등록에 성공했어요.",
                recipeId: createRecipe,
            });
        } catch (err) {
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
            });
        }
    };

    public errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new ValidationException(err.message);
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };
}
