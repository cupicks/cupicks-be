import * as jwtLib from "jsonwebtoken";
import { RequestHandler, Request, Response, NextFunction } from "express";

import { JwtProvider } from "../../modules/_.loader";

export const tokenMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req?.headers?.authorization;
    if (bearerToken === undefined) {
        return next();
    } else {
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
    }
};
