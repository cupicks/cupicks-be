import { RequestHandler, Request, Response } from "express";

import { CustomException, UnkownError, UnkownTypeError, ValidationException } from "../../models/_.loader";
import {
    CreateRecipeDto,
    UpdateRecipeDto,
    DeleteRecipeDto,
    CommonRecipeDto,
    GetRecipeDto,
} from "../../models/_.loader";
import { JoiValidator } from "../../modules/_.loader";
import { RecipeService } from "../services/_.exporter";
import { IRecipeCombinedPacket } from "../../models/_.loader";

export default class RecipeController {
    private recipeService: RecipeService;

    constructor() {
        this.recipeService = new RecipeService();
    }
    // Create

    public createRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const CreateRecipeValidator = await new JoiValidator().validateAsync<CreateRecipeDto>(
                new CreateRecipeDto({
                    title: req.body.title,
                    content: req.body.content,
                    isIced: req.body.isIced,
                    cupSize: req.body.cupSize,
                    isPublic: req.body.isPublic,
                    ingredientList: req.body.ingredientList,
                    userId: res.locals.userId,
                }),
            );

            const createRecipe = await this.recipeService.createRecipe(CreateRecipeValidator);

            return res.status(201).json({
                isSuccess: true,
                message: "레시피 등록에 성공하셨습니다",
                recipeId: createRecipe,
            });
        } catch (err) {
            console.log(err);
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
            });
        }
    };

    // Get

    public getRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const getRecipeValidator: CommonRecipeDto = await new JoiValidator().validateAsync<CommonRecipeDto>(
                new CommonRecipeDto({
                    recipeId: Number(req.params.recipeId),
                }),
            );

            const getRecipe: IRecipeCombinedPacket[] = await this.recipeService.getRecipe(getRecipeValidator.recipeId);

            return res.status(200).json({
                isSuccess: true,
                message: "레시피 조회에성공하셨습니다.",
                recipe: {
                    recipeId: getRecipe[0].recipeId,
                    nickname: getRecipe[0].nickname,
                    imageUrl: getRecipe[0].imageUrl,
                    resizedUrl: getRecipe[0].resizedUrl,
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
                errorCode: exception.errorCode,
            });
        }
    };

    public getRecipes: RequestHandler = async (req: Request, res: Response) => {
        try {
            const getRecipesValidator = await new JoiValidator().validateAsync<GetRecipeDto>(
                new GetRecipeDto({
                    page: Number(req.query.page),
                    count: Number(req.query.count),
                }),
            );

            const recipeDtoList = await this.recipeService.getRecipes(getRecipesValidator);

            return res.json({
                isSuccess: true,
                message: "레시피 조회에성공하셨습니다.",
                recipeList: recipeDtoList,
            });
        } catch (err) {
            console.log(err);
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
            });
        }
    };

    // Update

    public updatedRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const updateRecipeValidator: UpdateRecipeDto = await new JoiValidator().validateAsync<UpdateRecipeDto>(
                new UpdateRecipeDto({
                    title: req.body.title,
                    content: req.body.content,
                    isIced: req.body.isIced,
                    isPublic: req.body.isPublic,
                    ingredientList: req.body.ingredientList,
                    userId: res.locals.userId,
                    recipeId: Number(req.params.recipeId),
                }),
            );

            await this.recipeService.updateRecipe(updateRecipeValidator);

            return res.status(200).json({
                isSuccess: true,
                message: "레시피 수정에 성공하셨습니다.",
                recipeId: updateRecipeValidator.recipeId,
            });
        } catch (err) {
            console.log(err);
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
            });
        }
    };

    // Delete

    public deleteRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const deleteRecipeValidator: DeleteRecipeDto = await new JoiValidator().validateAsync<DeleteRecipeDto>(
                new DeleteRecipeDto({
                    userId: res.locals.userId,
                    recipeId: Number(req.params.recipeId),
                }),
            );

            await this.recipeService.deleteRecipe(deleteRecipeValidator);

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
                errorCode: exception.errorCode,
            });
        }
    };

    // Special

    public likeRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const likeRecipeValidator = await new JoiValidator().validateAsync<DeleteRecipeDto>(
                new DeleteRecipeDto({
                    userId: res.locals.userId,
                    recipeId: Number(req.params.recipeId),
                }),
            );

            await this.recipeService.likeRecipe(likeRecipeValidator);

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
                errorCode: exception.errorCode,
            });
        }
    };

    public disLikeRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const disLikeRecipeValidator = await new JoiValidator().validateAsync<DeleteRecipeDto>(
                new DeleteRecipeDto({
                    userId: res.locals.userId,
                    recipeId: Number(req.params.recipeId),
                }),
            );

            await this.recipeService.disLikeRecipe(disLikeRecipeValidator);

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
                errorCode: exception.errorCode,
            });
        }
    };

    public errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new UnkownError(err.message);
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };
}
