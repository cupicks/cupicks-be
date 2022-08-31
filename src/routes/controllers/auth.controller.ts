import * as joi from "joi";
import { Request, Response } from "express";
import { SignupUserDto, CustomException, UnkownTypeError, UnkownError } from "../../models/_.loader";
import { JoiValidator } from "../../modules/_.loader";

export default class AuthController {
    public errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new UnkownError(err.message);
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };

    public createUser = async (req: Request, res: Response) => {
        try {
            // const result = await joi.object<SignupUserDto>({
            //     email: joi.string().required().trim().max(20),
            //     nickname: joi.string().required().trim().min(2).max(10),
            //     password: joi.string().required().trim().min(8).max(15),
            //     imageUrl: joi.string().required().max(255)
            // }).validateAsync({...req.body});
            // console.log(result);

            const signupUserDto = await new JoiValidator().validateAsync<SignupUserDto>(
                new SignupUserDto({
                    ...req.body,
                    imageUrl: "http://hello.com",
                }),
            );

            return res.json({
                message: "성공의 경우",
            });
        } catch (err) {
            console.log(err);

            // 커스텀 예외와 예외를 핸들러를 이용한 비즈니스 로직 간소화
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
            });
        }
    };
}
