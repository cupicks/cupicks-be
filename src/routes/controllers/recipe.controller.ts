import { RequestHandler, Request, Response } from "express";

import { CustomException, UnkownTypeError, ValidationException } from "../../models/_.loader";
import {
    CreateRecipeDto,
    UpdateRecipeDto,
    DeleteRecipeDto,
    CommonRecipeDto,
    GetRecipeDto,
} from "../../models/_.loader";
import { JoiValidator } from "../../modules/_.loader";
import { RecipeService } from "../services/_.exporter";
import { IRecipeIngredientCustom } from "../../constants/_.loader";

export default class RecipeController {
    private recipeService: RecipeService;

    constructor() {
        this.recipeService = new RecipeService();
    }

    public createRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const validator = await new JoiValidator().validateAsync<CreateRecipeDto>(
                new CreateRecipeDto(req.body, res.locals.userId),
            );

            const createRecipe = await this.recipeService.createRecipe(validator, validator.userId);

            return res.status(201).json({
                isSuccess: true,
                message: "레시피 등록에 성공하셨습니다",
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

    public getRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const validator: CommonRecipeDto = await new JoiValidator().validateAsync<CommonRecipeDto>(
                new CommonRecipeDto({
                    recipeId: Number(req.params.recipeId),
                }),
            );

            const getRecipe: IRecipeIngredientCustom = await this.recipeService.getRecipe(validator.recipeId);

            return res.status(200).json({
                isSuccess: true,
                message: "레시피 조회에성공하셨습니다.",
                recipe: {
                    recipeId: getRecipe[0].recipeId,
                    title: getRecipe[0].title,
                    content: getRecipe[0].content,
                    isIced: getRecipe[0].isIced,
                    cupSize: getRecipe[0].cupSize,
                    createdAt: getRecipe[0].createdAt,
                    updatedAt: getRecipe[0].updatedAt,
                    ingredientList: getRecipe.map((e) => {
                        return {
                            ingredientName: e.ingredientName,
                            ingredientColor: e.ingredientColor,
                            ingredientAmount: e.ingredientAmount,
                        };
                    }),
                },
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

    public getRecipes: RequestHandler = async (req: Request, res: Response) => {
        try {
            const validator = await new JoiValidator().validateAsync<GetRecipeDto>(
                new GetRecipeDto({
                    page: Number(req.query.page),
                    count: Number(req.query.count),
                }),
            );

            const result = await this.recipeService.getRecipes(validator.page, validator.count);

            console.log(result);

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

    public deleteRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const validator: DeleteRecipeDto = await new JoiValidator().validateAsync<DeleteRecipeDto>(
                new DeleteRecipeDto({
                    userId: res.locals.userId,
                    recipeId: Number(req.params.recipeId),
                }),
            );

            await this.recipeService.deleteRecipe(validator.recipeId, validator.userId);

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

    public updatedRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const validator: UpdateRecipeDto = await new JoiValidator().validateAsync<UpdateRecipeDto>(
                new UpdateRecipeDto(req.body, res.locals.userId, Number(req.params.recipeId)),
            );

            await this.recipeService.updateRecipe(validator, validator.recipeId, validator.userId);

            return res.status(200).json({
                isSuccess: true,
                message: "레시피 수정에 성공하셨습니다.",
                recipeId: validator.recipeId,
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

    public likeRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const validator = await new JoiValidator().validateAsync<DeleteRecipeDto>(
                new DeleteRecipeDto({
                    userId: res.locals.userId,
                    recipeId: Number(req.params.recipeId),
                }),
            );

            await this.recipeService.likeRecipe(validator.userId, validator.recipeId);

            return res.status(201).json({
                isSuccess: false,
                message: "좋아요에 성공하셨습니다",
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

    public disRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const validator = await new JoiValidator().validateAsync<DeleteRecipeDto>(
                new DeleteRecipeDto({
                    userId: res.locals.userId,
                    recipeId: Number(req.params.recipeId),
                }),
            );

            await this.recipeService.dislikeRecipe(validator.userId, validator.recipeId);

            return res.status(201).json({
                isSuccess: false,
                message: `좋아요 취소에 성공하셨습니다.`,
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

    public errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new ValidationException(err.message);
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };
}
