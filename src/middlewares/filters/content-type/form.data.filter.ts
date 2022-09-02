import { RequestHandler, Request, Response, NextFunction } from "express";

export const formDataFilter: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const type = req.headers["content-type"]!.split(";")[0];

    if (type === "multipart/form-data") return next();

    return res.status(500).json(`content-type은 multipart/form-data 형식이어야 해요.`);
};
