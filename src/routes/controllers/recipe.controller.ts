import { RequestHandler, Request, Response, NextFunction } from "express";

import { CustomException, UnkownTypeError, ValidationException } from "../../models/_.loader";
import { CreateRecipeDto, UpdateRecipeDto } from "../../models/_.loader";
import { JoiValidator } from "../../modules/_.loader";
import { RecipeService } from "../services/_.exporter";

export default class RecipeController {
    private recipeService: RecipeService;

    constructor() {
        this.recipeService = new RecipeService();
    }

    public createRecipe: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = res.locals.userId !== "undefined" ? 1 : res.locals.userId;

            const validator = await new JoiValidator().validateAsync<CreateRecipeDto>(new CreateRecipeDto(req.body));

            const createRecipe = await this.recipeService.createRecipe(validator, userId);

            return res.status(201).json({
                isSuccess: true,
                message: "레시피 작성에 성공하였습니다.",
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

    public getRecipes: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.query.page && !req.query.count) throw new Error("페이지 번호나 개수를 확인해 주세요.");

            const page = Number(req.query.page);
            const count = Number(req.query.count);

            const results = await this.recipeService.getRecipes(page, count);

            const give = {};

            if (Array.isArray(results)) {
                console.log(results);
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

    public deleteRecipe: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.params.recipeId) throw new Error("레시피 번호를 확인해주세요.");

            const userId = res.locals.userId !== "undefined" ? 1 : res.locals.userId;
            const recipeId: number = Number(req.params.recipeId) as number;

            const result: boolean | undefined = await this.recipeService.deleteRecipe(recipeId, userId);

            if (result === false) throw new Error("내가 작성한 레시피가 아닙니다.");

            return res.status(200).json({
                isSuccess: true,
                message: "레시피 삭제에 성공하셨습니다.",
            });
        } catch (err) {
            console.log(err);
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
            });
        }
    };

    public updatedRecipe: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.params.recipeId) throw new Error("레시피 번호를 확인해주세요.");

            const userId = res.locals.userId !== "undefined" ? 1 : res.locals.userId;
            const recipeId: number = Number(req.params.recipeId) as number;

            const validator: UpdateRecipeDto = await new JoiValidator().validateAsync<UpdateRecipeDto>(
                new UpdateRecipeDto(req.body),
            );

            const updateRecipe = await this.recipeService.updateRecipe(validator, recipeId, userId);

            console.log(updateRecipe);

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
        else if (err instanceof Error) return new ValidationException(err.message);
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };
}
