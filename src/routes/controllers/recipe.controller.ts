import { RequestHandler, Request, Response, NextFunction } from "express";

import { CustomException, UnkownError, ValidationException } from "../../models/_.loader";
import { CreateRecipeDto } from "../../models/_.loader";
import { JoiValidator } from "../../modules/_.loader";

export default class RecipeController {
    public errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new UnkownError(err.message);
        else return new ValidationException(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };

    public createPost: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const createRecipe = await new JoiValidator().validateAsync<CreateRecipeDto>(new CreateRecipeDto(req.body));
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

    public test: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.file);
            res.end();
        } catch (err) {
            console.log(err);
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
            });
        }
    };
}
