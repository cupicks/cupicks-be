import { RequestHandler, Request, Response } from "express";

import { DtoFactory } from "../../modules/_.loader";

import { CustomException, UnkownError, UnkownTypeError, BestRecipeDto } from "../../models/_.loader";
import { RankingService } from "../services/_.exporter";

export class RankingController {
    private dtoFactory: DtoFactory;
    private rankingService: RankingService;

    constructor() {
        this.dtoFactory = new DtoFactory();
        this.rankingService = new RankingService();
    }

    public getWeeklyBestRecipesByLike: RequestHandler = async (req: Request, res: Response) => {
        try {
            const weeklyBestRecipesValidator: BestRecipeDto = await this.dtoFactory.getBestRecipeDto({
                userId: res.locals.userId,
            });

            const getWeeklyBestRecipes = await this.rankingService.getWeeklyBestRecipesByLike(
                weeklyBestRecipesValidator,
            );

            return res.json({
                isSuccess: true,
                message: "레시피 조회에성공하셨습니다.",
                bestRecipeList: getWeeklyBestRecipes,
            });
            return res.end();
        } catch (err) {
            console.log(err);
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
