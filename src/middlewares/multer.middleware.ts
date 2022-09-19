import { RequestHandler, Request, Response, NextFunction } from "express";

import { MulterProvider } from "../modules/_.loader";

export const multerMiddlewareForProfile: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    MulterProvider.uploadImageProfile(req, res, (err) => {
        if (!res.locals)
            return res.status(401).json({
                isSuccess: false,
                message: "존재하지 않는 사용자입니다 AUTH-002",
            });

        if (err)
            return res.status(401).json({
                isSuccess: false,
                message: err,
            });

        return next();
    });
};

export const multerMiddlewareForComment: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    MulterProvider.uploadImageComment(req, res, (err) => {
        if (!res.locals)
            return res.status(401).json({
                isSuccess: false,
                message: "존재하지 않는 사용자입니다 AUTH-002",
            });

        if (err)
            return res.status(401).json({
                isSuccess: false,
                message: err,
            });

        return next();
    });
};
