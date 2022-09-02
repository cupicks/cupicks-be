import { RequestHandler, Request, Response, NextFunction } from "express";

export const preventLoginUserGuard: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const originPath = req.originalUrl;
    const originPathExceptQuery = originPath.split("?")[0];

    const bearerToken = req?.headers?.authorization;
    if (bearerToken !== undefined)
        return res.status(401).json(`${originPathExceptQuery} Bearer Token 이 포함된 사용자는 이용할 수 없습니다.`);

    return next();
};
