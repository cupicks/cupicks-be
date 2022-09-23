import { Request, RequestHandler, Response } from "express";

// Module Dependencies

import { DtoFactory } from "../../modules/_.loader";
import { ProfileService } from "../services/profile.service";

// CustomExceptions

import { CustomException, UnkownTypeError, UnkownError } from "../../models/_.loader";

export default class ProfileController {
    private profileService: ProfileService;
    private dtoFactory: DtoFactory;

    constructor() {
        this.profileService = new ProfileService();
        this.dtoFactory = new DtoFactory();
    }

    /**
     * @deprecated
     */
    public getAllProfilesTemp: RequestHandler = async (req: Request, res: Response) => {
        try {
            const result = await this.profileService.getAllProfile();
            return res.status(200).json({
                result,
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

    public editProfile: RequestHandler = async (req: Request, res: Response) => {
        try {
            const file = req.file as Express.MulterS3.File;

            const editDto = await this.dtoFactory.getEditProfileDto({
                userId: res.locals.userId,
                nickname: req.query.nickname,
                password: req.query.password,

                imageUrl: file?.location,
                resizedUrl: file?.location,
            });
            await this.profileService.editProfile(editDto);

            return res.json({
                isSuccess: true,
                message: "프로필 수정에 성공하셨습니다.",
                userId: editDto.userId,
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

    public getMyRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const getMyRecipeDto = await this.dtoFactory.getGetMyRecipeDto({
                userId: res.locals.userId,
                count: req?.query["count"],
                page: req?.query["page"],
            });

            const recipeDtoList = await this.profileService.getMyRecipe(getMyRecipeDto);

            return res.json({
                isSuccess: true,
                message: "레시피 조회에성공하셨습니다.",
                recipeList: recipeDtoList,
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

    public getLikeRecipe: RequestHandler = async (req: Request, res: Response) => {
        try {
            const getLikeRecipeDto = await this.dtoFactory.getGetLikeRecipeDto({
                userId: res.locals.userId,
                count: req?.query["count"],
                page: req?.query["page"],
            });

            const recipeDtoList = await this.profileService.getLikeRecipe(getLikeRecipeDto);

            return res.json({
                isSuccess: true,
                message: "레시피 조회에성공하셨습니다.",
                recipeList: recipeDtoList,
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

    public errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new UnkownError(err.message);
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };
}
