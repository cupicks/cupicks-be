import { RequestHandler, Request, Response, NextFunction } from "express";

export const applicationXWwwFormUrlencodedFilter: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    // /api/auth/signin?search=user
    const originUrl: string = req.originalUrl;

    // /api/auth/signin
    const originUrlExceptQuery: string = originUrl.split("?")[0];

    if (req.headers["content-type"] === "application/x-www-form-urlencoded") return next();
    else
        return res
            .status(500)
            .json(
                `${originUrlExceptQuery} 도메인의 content-type 은 application/x-www-form-urlencoded 와 일치해야 합니다.`,
            );
};
