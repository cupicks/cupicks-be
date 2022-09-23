import { NextFunction, Request, RequestHandler, Response } from "express";
import {
    UnkownError,
    UnkownTypeError,
    CustomException,
    SignupUserDto,
    SigninUserDto,
    LogoutUserDto,
    PublishTokenDto,
    SendEmailDto,
    ConfirmEmailDto,
    ConfirmNicknameDto,
    SendPasswordDto,
    ResetPasswordDto,
} from "../../models/_.loader";
import { JoiValidator } from "../../modules/_.loader";
import { AuthService } from "../services/_.exporter";

export default class AuthController {
    static FRONT_URL: string;

    static init(FRONT_URL: string) {
        this.FRONT_URL = FRONT_URL;
    }

    private authService: AuthService;
    private joiValidator: JoiValidator;

    constructor() {
        this.authService = new AuthService();
        this.joiValidator = new JoiValidator();
    }

    public signup: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = req.file as Express.MulterS3.File;

            /**
             * 1주차 기술 피드백 - https://github.com/cupicks/cupicks-be/issues/51
             *
             * TypeScript 와 Dto 을 사용하고 있다면 class-validator 를 사용하고 미들웨어처럼 만드는 것은 어떨까요?
             */
            const signupUserDto: SignupUserDto = await this.joiValidator.validateAsync<SignupUserDto>(
                new SignupUserDto({
                    imageUrl: file?.location,
                    resizedUrl: file?.location,
                    password: req?.query["password"],
                    emailVerifyToken: req?.query["emailVerifyToken"],
                    nicknameVerifyToken: req?.query["nicknameVerifyToken"],
                }),
            );

            const result = await this.authService.signup(signupUserDto);

            return res.json({
                isSuccess: true,
                message: "회원가입에 성공하셨습니다.",
                user: result,
            });
        } catch (err) {
            console.log(err);
            // 커스텀 예외와 예외를 핸들러를 이용한 비즈니스 로직 간소화
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
                ...exception.errorResult,
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
                errorCode: exception.errorCode,
                ...exception.errorResult,
            });
        }
    };

    public logout: RequestHandler = async (req: Request, res: Response) => {
        try {
            const logoutUserDto = await this.joiValidator.validateAsync<LogoutUserDto>(
                new LogoutUserDto({
                    refreshToken: req?.query["refreshToken"],
                }),
            );

            await this.authService.logout(logoutUserDto);

            return res.json({
                isSuccess: true,
                message: "로그아웃에 성공하셨습니다.",
            });
        } catch (err) {
            console.log(err);
            // 커스텀 예외와 예외를 핸들러를 이용한 비즈니스 로직 간소화
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
                ...exception.errorResult,
            });
        }
    };

    public publishToken: RequestHandler = async (req: Request, res: Response) => {
        try {
            const publishTokenDto = await this.joiValidator.validateAsync<PublishTokenDto>(
                new PublishTokenDto({
                    refreshToken: req?.query["refreshToken"],
                }),
            );

            const accessToken = await this.authService.publishToken(publishTokenDto);

            return res.json({
                isSuccess: true,
                message: "토큰 재발행에 성공하셨습니다.",
                accessToken,
            });
        } catch (err) {
            console.log(err);
            // 커스텀 예외와 예외를 핸들러를 이용한 비즈니스 로직 간소화
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
                ...exception.errorResult,
            });
        }
    };

    public sendEmail: RequestHandler = async (req: Request, res: Response) => {
        try {
            const sendEmailDto = await this.joiValidator.validateAsync<SendEmailDto>(
                new SendEmailDto({
                    email: req?.query["email"],
                }),
            );

            const result = await this.authService.sendEmail(sendEmailDto);

            return res.status(201).json({
                isSuccess: true,
                message: `사용자 이메일로 6자리 숫자가 발송되었어요!`,
                date: result.date,
                exceededDate: result.exceededDate,
            });
        } catch (err) {
            console.log(err);
            // 커스텀 예외와 예외를 핸들러를 이용한 비즈니스 로직 간소화
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
                ...exception.errorResult,
            });
        }
    };

    public confirmEmailCode: RequestHandler = async (req: Request, res: Response) => {
        try {
            const confirmEailDto = await this.joiValidator.validateAsync<ConfirmEmailDto>(
                new ConfirmEmailDto({
                    email: req?.query["email"],
                    emailVerifyCode: req?.query["email-verify-code"],
                }),
            );

            const { emailVerifyToken } = await this.authService.confirmEmailCode(confirmEailDto);

            return res.json({
                isSuccess: true,
                message: "사용자 이메일 인증이 완료되었습니다.",
                emailVerifyToken: emailVerifyToken,
            });
        } catch (err) {
            console.log(err);
            // 커스텀 예외와 예외를 핸들러를 이용한 비즈니스 로직 간소화
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
                ...exception.errorResult,
            });
        }
    };

    public confirmNickname: RequestHandler = async (req: Request, res: Response) => {
        try {
            const confirmNicknameDto = await this.joiValidator.validateAsync<ConfirmNicknameDto>(
                new ConfirmNicknameDto({
                    emailVerifyToken: req?.query["emailVerifyToken"],
                    nickname: req?.query["nickname"],
                }),
            );

            const { nicknameVerifyToken } = await this.authService.confirmNickname(confirmNicknameDto);

            return res.json({
                isSuccess: true,
                message: "사용자 닉네임 중복확인이 완료되었습니다.",
                nicknameVerifyToken: nicknameVerifyToken,
            });
        } catch (err) {
            console.log(err);
            // 커스텀 예외와 예외를 핸들러를 이용한 비즈니스 로직 간소화
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
                ...exception.errorResult,
            });
        }
    };

    public sendPassword: RequestHandler = async (req: Request, res: Response) => {
        try {
            const snedPasswordDto = await this.joiValidator.validateAsync<SendPasswordDto>(
                new SendPasswordDto({
                    email: req?.query["email"],
                }),
            );

            const result = await this.authService.sendPassword(snedPasswordDto);

            return res.status(201).json({
                isSuccess: true,
                message: `임시 비밀번호를 이메일로 발송했어요!`,
                date: result.date,
                exceededDate: result.exceededDate,
            });
        } catch (err) {
            console.log(err);
            // 커스텀 예외와 예외를 핸들러를 이용한 비즈니스 로직 간소화
            const exception = this.errorHandler(err);
            return res.status(exception.statusCode).json({
                isSuccess: false,
                message: exception.message,
                errorCode: exception.errorCode,
                ...exception.errorResult,
            });
        }
    };

    public resetPassword: RequestHandler = async (req: Request, res: Response) => {
        try {
            const snedPasswordDto = await this.joiValidator.validateAsync<ResetPasswordDto>(
                new ResetPasswordDto({
                    resetPasswordToken: req?.query["resetPasswordToken"],
                }),
            );

            const email = await this.authService.resetPassword(snedPasswordDto);

            // FE message : 'ㅇㅇㅇㅇ@naver.com 님 임시 비밀번호를 사용하실 수 있습니다.'
            return res.redirect(AuthController.FRONT_URL + `/signIn?email=` + email);
        } catch (err) {
            console.log(err);
            // 커스텀 예외와 예외를 핸들러를 이용한 비즈니스 로직 간소화
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
