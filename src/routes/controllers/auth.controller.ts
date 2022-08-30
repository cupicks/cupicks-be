import { NextFunction, Request, RequestHandler, Response } from "express";
import { SignupUserDto, CustomException, UnkownTypeError, UnkownError, SigninUserDto } from "../../models/_.loader";
import { JoiValidator } from "../../modules/_.lodaer";

export default class AuthController {
    public errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new UnkownError(err.message);
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };

    public signup: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const signupUserDto: SignupUserDto = await new JoiValidator().validateAsync<SignupUserDto>(
                new SignupUserDto({
                    ...req.body,
                    imageUrl: "http://hello.com",
                }),
            );

            return res.json({
                message: "성공의 경우",
            });
        } catch (err) {
            // 커스텀 예외와 예외를 핸들러를 이용한 비즈니스 로직 간소화
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
            });
        }
    };

    public signin: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const singInUserDto: SigninUserDto = await new JoiValidator().validateAsync<SigninUserDto>(
                new SigninUserDto({
                    ...req.body,
                }),
            );

            return res.json({
                message: "성공의 경우",
            });
        } catch (err) {
            // 커스텀 예외와 예외를 핸들러를 이용한 비즈니스 로직 간소화
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
            });
        }
    };
}
