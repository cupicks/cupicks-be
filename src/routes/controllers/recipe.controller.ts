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

            // 입력값 유효성 검사
            // await joi
            //     .object({
            //         title: joi.string().trim().min(2).max(20).required(),
            //         content: joi.string().trim().max(255).required(),
            //         isIced: joi.boolean().required(),
            //         cupSize: joi.number().equal(355, 473, 591),
            //         ingredientList: joi
            //             .array()
            //             .items(
            //                 joi.object({
            //                     ingredientName: joi.string().trim().min(1).max(20).required(),
            //                     ingredientColor: joi.string().trim().min(7).max(7).required(),
            //                     ingredientAmount: joi.number().max(1000).required(),
            //                 }),
            //             )
            //             .min(1)
            //             .max(20),
            //     })
            //     .validateAsync(req.body);
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
