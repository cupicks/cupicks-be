import { RequestHandler, Request, Response } from "express";

// Module Dependencies

import { RecipeService } from "../services/_.exporter";
import { DtoFactory } from "../../modules/_.loader";

// Dtos, CustomExceptions

import {
    CreateRecipeDto,
    UpdateRecipeDto,
    DeleteRecipeDto,
    CommonRecipeDto,
    GetRecipeDto,
    CustomException,
    UnkownError,
    UnkownTypeError,
} from "../../models/_.loader";

export class RecipeController {
    private recipeService: RecipeService;
    private dtoFactory: DtoFactory;

    constructor() {
        this.recipeService = new RecipeService();
        this.dtoFactory = new DtoFactory();
    }
    // Create

    public createRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const createRecipeValidator: CreateRecipeDto = await this.dtoFactory.getCreateRecipeDto({
                title: req.body.title,
                content: req.body.content,
                isIced: req.body.isIced,
                cupSize: req.body.cupSize,
                isPublic: req.body.isPublic,
                ingredientList: req.body.ingredientList,
                userId: res.locals.userId,
                category: req.body.category,
            });

            const createRecipe = await this.recipeService.createRecipe(createRecipeValidator);

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
                errorCode: exception.errorCode,
                ...exception.errorResult,
            });
        }
    };

    // Get

    public getRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const getRecipeValidator: CommonRecipeDto = await this.dtoFactory.getCommonRecipeDto({
                recipeId: Number(req.params.recipeId),
                userId: res.locals.userId,
            });

            const getRecipe = await this.recipeService.getRecipe(getRecipeValidator);

            return res.status(200).json({
                isSuccess: true,
                message: "레시피 조회에성공하셨습니다.",
                recipe: getRecipe,
            });
        } catch (err) {
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
                ...exception.errorResult,
            });
        }
    };

    public getRecipes: RequestHandler = async (req: Request, res: Response) => {
        try {
            const getRecipesValidator: GetRecipeDto = await this.dtoFactory.getRecipeDto(
                new GetRecipeDto({
                    page: Number(req.query.page),
                    count: Number(req.query.count),
                    userId: res.locals.userId,
                }),
            );

            const getRecipes = await this.recipeService.getRecipes(getRecipesValidator);

            return res.json({
                isSuccess: true,
                message: "레시피 조회에성공하셨습니다.",
                recipeList: getRecipes,
            });
        } catch (err) {
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
                ...exception.errorResult,
            });
        }
    };

    // Update

    public updatedRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const updateRecipeValidator: UpdateRecipeDto = await this.dtoFactory.getUpdateRecipeDto({
                title: req.body.title,
                content: req.body.content,
                isIced: req.body.isIced,
                isPublic: req.body.isPublic,
                ingredientList: req.body.ingredientList,
                userId: res.locals.userId,
                recipeId: Number(req.params.recipeId),
                category: req.body.category,
            });

            await this.recipeService.updateRecipe(updateRecipeValidator);

            return res.status(200).json({
                isSuccess: true,
                message: "레시피 수정에 성공하셨습니다.",
                recipeId: updateRecipeValidator.recipeId,
            });
        } catch (err) {
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
                ...exception.errorResult,
            });
        }
    };

    // Delete

    public deleteRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const deleteRecipeValidator: DeleteRecipeDto = await this.dtoFactory.getDeleteRecipeDto({
                userId: res.locals.userId,
                recipeId: Number(req.params.recipeId),
            });

            await this.recipeService.deleteRecipe(deleteRecipeValidator);

            return res.status(200).json({
                isSuccess: true,
                message: "레시피 삭제에 성공하셨습니다.",
            });
        } catch (err) {
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
                ...exception.errorResult,
            });
        }
    };

    // Special

    public likeRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const likeRecipeValidator: DeleteRecipeDto = await this.dtoFactory.getDeleteRecipeDto({
                userId: res.locals.userId,
                recipeId: Number(req.params.recipeId),
            });

            await this.recipeService.likeRecipe(likeRecipeValidator);

            return res.status(201).json({
                isSuccess: true,
                message: "좋아요에 성공하셨습니다",
            });
        } catch (err) {
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
                ...exception.errorResult,
            });
        }
    };

    public disLikeRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const disLikeRecipeValidator: DeleteRecipeDto = await this.dtoFactory.getDeleteRecipeDto({
                userId: res.locals.userId,
                recipeId: Number(req.params.recipeId),
            });

            await this.recipeService.disLikeRecipe(disLikeRecipeValidator);

            return res.status(201).json({
                isSuccess: true,
                message: `좋아요 취소에 성공하셨습니다.`,
            });
        } catch (err) {
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
                ...exception.errorResult,
            });
        }
    };

    public errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new UnkownError(err.message);
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };
}
