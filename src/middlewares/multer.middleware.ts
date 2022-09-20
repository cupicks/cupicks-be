import { TERROR_CODE } from "../constants/_.loader";
import { RequestHandler, Request, Response, NextFunction } from "express";

import { MulterProvider } from "../modules/_.loader";

export const multerMiddlewareForProfile: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    MulterProvider.uploadImageProfile(req, res, (err) => {
        if (!res.locals) {
            const errorCode: TERROR_CODE = "AUTH-002";
            return res.status(401).json({
                isSuccess: false,
                message: "존재하지 않는 사용자입니다 ",
                errorCode,
            });
        }

        if (err) {
            const errorCode: TERROR_CODE = "UNKOWN";
            return res.status(401).json({
                isSuccess: false,
                message: err,
                errorCode,
            });
        }

        return next();
    });
};

export const multerMiddlewareForComment: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    MulterProvider.uploadImageComment(req, res, (err) => {
        if (!res.locals) {
            const errorCode: TERROR_CODE = "AUTH-002";
            return res.status(401).json({
                isSuccess: false,
                message: "존재하지 않는 사용자입니다 ",
                errorCode,
            });
        }

        if (err) {
            const errorCode: TERROR_CODE = "UNKOWN";
            return res.status(401).json({
                isSuccess: false,
                message: err,
                errorCode,
            });
        }

        return next();
    });
};
