import e from "cors";
import { RequestHandler, Request, Response, NextFunction } from "express";

export const formDataFilter: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    // /api/auth/signin?search=user
    const originUrl: string = req.originalUrl;

    // /api/auth/signin
    const originUrlExceptQuery: string = originUrl.split("?")[0];

    const contentTypeList = req.headers["content-type"];
    const contentType = contentTypeList?.split(";")[0];

    if (contentType === undefined) {
        return res
            .status(500)
            .json(`${originUrlExceptQuery} 도메인의 content-type 은 multipart/form-data 와 일치해야 합니다.`);
    } else {
        const contentTypeExtractBoundary = contentType.split(";")[0];

        if (contentTypeExtractBoundary === "multipart/form-data") {
            return next();
        } else {
            return res
                .status(500)
                .json(`${originUrlExceptQuery} 도메인의 content-type 은 multipart/form-data 와 일치해야 합니다.`);
        }
    }
};
