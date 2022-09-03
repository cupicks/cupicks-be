import { RequestHandler, Request, Response, NextFunction } from "express";

import { MulterProvider } from "../modules/_.loader";

export const multerMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    MulterProvider.uploadSingle(req, res, (err) => {
        if (err) return res.json("지원하는 이미지 형식을 확인해주세요.");
        return next();
    });
};
