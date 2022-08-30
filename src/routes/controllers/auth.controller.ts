import { Request, Response, NextFunction } from "express";

export default class AuthController {
    public createUser = async (req: Request, res: Response) => {
        try {
            return res.json({
                message: "성공의 경우",
            });
        } catch (err) {
            return res.json("에러 발생의 경우");
        }
    };
}
