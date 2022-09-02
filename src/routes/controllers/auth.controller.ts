import * as joi from "joi";
import { Request, RequestHandler, Response } from "express";
import {
    SignupUserDto,
    CustomException,
    UnkownTypeError,
    UnkownError,
    SigninUserDto,
    PublishTokenDto,
} from "../../models/_.loader";
import { JoiValidator } from "../../modules/_.loader";
import { AuthService } from "../services/_.exporter";

export default class AuthController {
    private authService: AuthService;
    private joiValidator: JoiValidator;

    constructor() {
        this.authService = new AuthService();
        this.joiValidator = new JoiValidator();
    }

    public signup: RequestHandler = async (req: Request, res: Response) => {
        try {
            const file = req.file as Express.MulterS3.File;

            const signupUserDto: SignupUserDto = await this.joiValidator.validateAsync<SignupUserDto>(
                new SignupUserDto({
                    ...req.body,
                    imageUrl: file.location,
                }),
            );

            const result = await this.authService.signup(signupUserDto);

            return res.json({
                isSuccess: true,
                message: "회원가입에 성공하셨습니다.",
                user: result,
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

    public signin: RequestHandler = async (req: Request, res: Response) => {
        try {
            const singInUserDto: SigninUserDto = await this.joiValidator.validateAsync<SigninUserDto>(
                new SigninUserDto({
                    ...req.body,
                }),
            );

            const { accessToken, refreshToken } = await this.authService.signin(singInUserDto);

            return res.json({
                isSuccess: true,
                message: "로그인에 성공하셨습니다.",
                accessToken,
                refreshToken,
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

    public publishToken: RequestHandler = async (req: Request, res: Response) => {
        try {
            const publishTokenDto = await this.joiValidator.validateAsync<PublishTokenDto>(
                new PublishTokenDto(req?.query["refresh_token"]),
            );

            const accessToken = await this.authService.publishToken(publishTokenDto);

            return res.json({
                isSuccess: true,
                message: "엑세스 토큰 발행에 성공하셨습니다.",
                accessToken,
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

    public errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new UnkownError(err.message);
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };
}
