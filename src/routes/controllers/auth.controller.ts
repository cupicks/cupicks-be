import { RequestHandler, Request, Response } from "express";

// Module Dependencies

import { AuthService } from "../services/_.exporter";
import { DtoFactory } from "../../modules/_.loader";

// CustomExceptions

import { CustomException, UnkownTypeError, UnkownError } from "../../models/_.loader";

export class AuthController {
    static FRONT_URL: string;

    static init(FRONT_URL: string) {
        this.FRONT_URL = FRONT_URL;
    }

    private authService: AuthService;
    private dtoFactory: DtoFactory;

    constructor() {
        this.authService = new AuthService();
        this.dtoFactory = new DtoFactory();
    }

    public signup: RequestHandler = async (req: Request, res: Response) => {
        try {
            const file = req.file as Express.MulterS3.File;

            const signupUserDto = await this.dtoFactory.getSignupUserDto({
                imageUrl: file?.location,
                resizedUrl: file?.location,
                password: req?.body["password"],
                emailVerifyToken: req?.body["emailVerifyToken"],
                nicknameVerifyToken: req?.body["nicknameVerifyToken"],

                favorCupSizeList: req?.body["favorCupSizeList"],
                favorTemperatureList: req?.body["favorTemperatureList"],
                favorCategoryList: req?.body["favorCategoryList"],

                disfavorCupSizeList: req?.body["disfavorCupSizeList"],
                disfavorTemperatureList: req?.body["disfavorTemperatureList"],
                disfavorCategoryList: req?.body["disfavorCategoryList"],
            });

            const result = await this.authService.signup(signupUserDto);

            return res.status(201).json({
                isSuccess: true,
                message: "회원가입에 성공하셨습니다.",
                user: result,
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

    public signin: RequestHandler = async (req: Request, res: Response) => {
        try {
            const singInUserDto = await this.dtoFactory.getSigninUserDto(req.body);

            const result = await this.authService.signin(singInUserDto);

            return res.status(201).json({
                isSuccess: true,
                message: "로그인에 성공하셨습니다.",
                accessToken: result?.accessToken,
                refreshToken: result?.refreshToken,
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

    public logout: RequestHandler = async (req: Request, res: Response) => {
        try {
            const logoutUserDto = await this.dtoFactory.getLogoutUserDto({ refreshToken: req?.query["refreshToken"] });

            await this.authService.logout(logoutUserDto);

            return res.status(201).json({
                isSuccess: true,
                message: "로그아웃에 성공하셨습니다.",
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

    public publishToken: RequestHandler = async (req: Request, res: Response) => {
        try {
            const publishTokenDto = await this.dtoFactory.getPublishTokenDto({
                refreshToken: req?.query["refreshToken"],
            });
            const accessToken = await this.authService.publishToken(publishTokenDto);

            return res.status(201).json({
                isSuccess: true,
                message: "토큰 재발행에 성공하셨습니다.",
                accessToken: accessToken,
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

    public sendEmail: RequestHandler = async (req: Request, res: Response) => {
        try {
            const sendEmailDto = await this.dtoFactory.getSendEmailDto({ email: req?.body["email"] });

            const result = await this.authService.sendEmail(sendEmailDto);

            return res.status(201).json({
                isSuccess: true,
                message: "사용자 이메일로 6자리 숫자가 발송되었어요!",
                date: result?.date,
                exceededDate: result?.exceededDate,
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

    public confirmEmailCode: RequestHandler = async (req: Request, res: Response) => {
        try {
            const confirmEailDto = await this.dtoFactory.getConfirmEmailDto({
                email: req?.body["email"],
                emailVerifyCode: req?.body["emailVerifyCode"],
            });

            const result = await this.authService.confirmEmailCode(confirmEailDto);

            return res.status(201).json({
                isSuccess: true,
                message: "사용자 이메일 인증이 완료되었습니다.",
                emailVerifyToken: result?.emailVerifyToken,
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

    public confirmNickname: RequestHandler = async (req: Request, res: Response) => {
        try {
            const confirmNicknameDto = await this.dtoFactory.getConfirmNicknameDto({
                emailVerifyToken: req?.body["emailVerifyToken"],
                nickname: req?.body["nickname"],
            });

            const result = await this.authService.confirmNickname(confirmNicknameDto);

            return res.status(201).json({
                isSuccess: true,
                message: "사용자 닉네임 중복확인이 완료되었습니다.",
                nicknameVerifyToken: result?.nicknameVerifyToken,
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

    public sendPassword: RequestHandler = async (req: Request, res: Response) => {
        try {
            const snedPasswordDto = await this.dtoFactory.getSendPasswordDto({ email: req?.body["email"] });

            const result = await this.authService.sendPassword(snedPasswordDto);

            return res.status(201).json({
                isSuccess: true,
                message: "임시 비밀번호를 이메일로 발송했어요!",
                date: result?.date,
                exceededDate: result?.exceededDate,
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

    public resetPassword: RequestHandler = async (req: Request, res: Response) => {
        try {
            const resetPasswordDto = await this.dtoFactory.getResetPasswordDto({
                resetPasswordToken: req?.body["resetPasswordToken"],
            });

            const result = await this.authService.resetPassword(resetPasswordDto);

            const { accessToken, refreshToken } = result;
            return res.status(201).json({
                isSuccess: true,
                message: "임시 비밀번호로 변경이 완료 되었습니다.",
                accessToken,
                refreshToken,
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

    private errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new UnkownError(err.message);
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };
}
