import * as jwtLib from "jsonwebtoken";
import { RequestHandler, Request, Response, NextFunction } from "express";
import { JwtProvider } from "../../../modules/_.loader";

export const preventUnLoginUserGuard: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const originPath = req.originalUrl;
    const originPathExceptQuery = originPath.split("?")[0];

    const bearerToken = req?.headers?.authorization;
    if (bearerToken === undefined)
        return res.status(401).json(`${originPathExceptQuery} 은 Bearer Token 이 누락된 사용자는 이용할 수 없습니다.`);

    try {
        const jwtProvider = new JwtProvider();
        jwtProvider.extractToken(bearerToken);

        const payload = jwtProvider.verifyToken<jwtLib.IAccessTokenPayload>(jwtProvider.extractToken(bearerToken));

        res.locals.userId = payload.userId;
        res.locals.nickname = payload.nickname;

        return next();
    } catch (err) {
        if (err instanceof Error)
            return res.status(401).json(`유효하지 않은 AccessToken 을 제출하였습니다. ${err.message}`);
        return res.status(401).json(`유효하지 않은 AccessToken 을 제출하였습니다. ${JSON.stringify(err)}`);
    }
};
