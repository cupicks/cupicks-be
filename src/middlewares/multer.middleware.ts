import { RequestHandler, Request, Response, NextFunction } from "express";

import { MulterProvider } from "../modules/_.loader";

export const multerMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    MulterProvider.uploadSingle(req, res, (err) => {
        if (!res.locals)
            return res.status(401).json({
                isSuccess: false,
                message: "존재하지 않는 유저입니다.",
            });

        if (err)
            return res.status(401).json({
                isSuccess: false,
                message: "지원하는 이미지 형식을 확인해 주세요.",
            });

        return next();
    });
};
