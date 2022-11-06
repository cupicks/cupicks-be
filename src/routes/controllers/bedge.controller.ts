import { RequestHandler, Request, Response } from "express";

import { BedgeService } from "../services/bedge.service";
import { DtoFactory } from "../../modules/_.loader";
import { CustomException, UnkownError, UnkownTypeError } from "../../models/_.loader";

export class BedgeController {

    private bedgeService: BedgeService;
    private dtoFactory: DtoFactory;

    constructor() {
        this.bedgeService = new BedgeService();
        this.dtoFactory = new DtoFactory();
    }

    public getBedgeList: RequestHandler = async (req: Request, res: Response) => {

        try {
            const userId = res.locals.userId;

            const result = await this.bedgeService.getBedgeList(userId);

            return res.json({
                isSuccess: true,
                message: '뱃지 조회에 성공하셨니다.',
                bedgeList: result
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

    }

    private errorHandler = (err: unknown): CustomException => {
        if (err instanceof CustomException) return err;
        else if (err instanceof Error) return new UnkownError(err.message);
        else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    };

}