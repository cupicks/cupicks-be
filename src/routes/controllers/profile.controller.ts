import { JoiValidator } from "../../modules/_.loader";
import { CustomException, UnkownTypeError, UnkownError, EditProfileDto } from "../../models/_.loader";

import { Request, RequestHandler, Response } from "express";
import { ProfileService } from "../services/profile.service";

export default class ProfileController {
    private joiValidator: JoiValidator;
    private profileService: ProfileService;

    constructor() {
        this.joiValidator = new JoiValidator();
        this.profileService = new ProfileService();
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
            });
        }
    };

    public editProfile: RequestHandler = async (req: Request, res: Response) => {
        try {
            const file = req.file as Express.MulterS3.File;

            const editDto = await this.joiValidator.validateAsync<EditProfileDto>(
                new EditProfileDto({
                    userId: res.locals.userId,
                    nickname: req.query.nickname,
                    password: req.query.password,

                    imageUrl: file?.location,
                    resizedUrl: file?.location,
                }),
            );
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
            });
        }
    };

    public errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new UnkownError(err.message);
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };
}
