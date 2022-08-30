import { Request, Response, NextFunction } from "express";

export default class AuthController {
    public getBoundary = (request: Request) => {
        const contentType: string | undefined = request.headers["content-type"];
        if (contentType === undefined) throw new Error(`'Content-Type' 은 undefined 일 수 없습니다.`);

        const contentTypeArray = contentType.split(";").map((item) => item.trim());
        const boundaryPrefix = "boundary=";
        let boundary = contentTypeArray.find((item) => item.startsWith(boundaryPrefix));
        if (!boundary) return null;
        boundary = boundary.slice(boundaryPrefix.length);
        if (boundary) boundary = boundary.trim();
        return boundary;
    };

    public getMatching(word: string, regex: RegExp) {
        const matches = word.match(regex);
        if (!matches || matches.length < 2) {
            return null;
        }
        return matches[1];
    }

    public createUser = async (req: Request, res: Response) => {
        try {
            req.setEncoding("latin1");
            let rawDataGroup = "";
            await req.on("data", (chunk) => (rawDataGroup += chunk));
            await req.on("end", () => {
                const boundary = this.getBoundary(req);
                if (boundary === null) throw new Error(`boundary 가 누락되었습니다.`);

                const resultDataArray: Array<any> = [];
                const rawDataArray = rawDataGroup.split(boundary);
                for (const rawData of rawDataArray) {
                    let name = this.getMatching(rawData, /(?:name=")(.+?)(?:")/);
                    if (!name || !(name = name.trim())) continue;

                    const value = this.getMatching(rawData, /(?:\r\n\r\n)([\S\s]*)(?:\r\n--$)/);
                    if (!value) continue;

                    let filename = this.getMatching(rawData, /(?:filename=")(.*?)(?:")/);
                    if (filename && (filename = filename.trim())) {
                        const file = {
                            key: name,
                            name: value,
                            filename: filename,
                            contentType: ((): string => {
                                let contentType = this.getMatching(rawData, /(?:Content-Type:)(.*?)(?:\r\n)/);
                                if (contentType && (contentType = contentType.trim())) {
                                    return contentType;
                                }
                                throw new Error(`'Content-Type' 이 필요합니다.`);
                            })(),
                        };
                        resultDataArray.push(file);
                    } else {
                        const file = {
                            key: name,
                            name: value,
                            contentType: "text/plain",
                        };
                        resultDataArray.push(file);
                    }
                }
                resultDataArray.forEach((val) => {
                    console.log(`${val.key}, ${val.contentType}, ${val?.filename ? val?.filename : ""}`);
                });
                res.locals = resultDataArray;

                // console.log(res.locals);
            });

            return res.json({
                message: "성공의 경우",
                ...req.body,
            });
        } catch (err) {
            return res.json("에러 발생의 경우");
        }
    };
}
