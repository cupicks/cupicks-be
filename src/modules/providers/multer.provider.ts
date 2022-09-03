import { RequestHandler, NextFunction } from "express";
import path from "path";

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import * as multer from "multer";
import * as multerS3 from "multer-s3";

import { IS3ConfigEnv } from "models/_.loader";
import { CustomException, UnkownTypeError } from "../../models/_.loader";

export class MulterProvider {
    static isInit = false;
    static S3_ACCESS_KEY: string;
    static S3_SECRET_KEY: string;
    static REGION: string;
    static BUCKET: string;

    static init = ({ S3_ACCESS_KEY, S3_SECRET_KEY, REGION, BUCKET }: IS3ConfigEnv) => {
        if (this.isInit === true) return;

        this.S3_ACCESS_KEY = S3_ACCESS_KEY;
        this.S3_SECRET_KEY = S3_SECRET_KEY;
        this.REGION = REGION;
        this.BUCKET = BUCKET;
        this.isInit = true;
    };

    /**
     * 1주차 기술 피드백 - https://github.com/cupicks/cupicks-be/issues/51
     *
     * 지네릭 타입을 선언해놔도, 지네릭 값을 받지 못하면 사용할 수 없는 것으로 알고 있습니다.
     * 혹시 타입 자체를 사용할 수 있는 방법이 있나요?
     *
     *
     * 그런 방식은 존재하지 않고 요청 헤더의 ***KEY*** 가 변경되는 것이 문제라면 여러 upload 메서드를 많이 만들어도 될 것 같습니다.
     */
    static uploadSingle: RequestHandler = (req, res, next) => {
        return this.test().single("imageValue")(req, res, next);
    };

    static uploadNone: RequestHandler = (req, res, next) => {
        return this.test().none()(req, res, next);
    };

    static test = () => {
        const s3 = new S3Client({
            credentials: {
                accessKeyId: MulterProvider.S3_ACCESS_KEY,
                secretAccessKey: MulterProvider.S3_SECRET_KEY,
            },
            region: MulterProvider.REGION,
        });

        return multer({
            storage: multerS3({
                s3,
                bucket: MulterProvider.BUCKET,
                key(req, file, done) {
                    done(null, `profile/${Date.now()}${file.originalname}`);
                },
            }),
            fileFilter(req, file, done) {
                if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
                    done(null, true);
                } else {
                    return done(new Error("error"));
                }
            },
            limits: { fileSize: 5 * 1024 * 1024 },
        });
    };

    static deleteImage = async (targetImageValue: string) => {
        // test 메서드 코드와 중복 객체!
        const s3 = new S3Client({
            credentials: {
                accessKeyId: MulterProvider.S3_ACCESS_KEY,
                secretAccessKey: MulterProvider.S3_SECRET_KEY,
            },
            region: MulterProvider.REGION,
        });

        return await s3.send(
            new DeleteObjectCommand({
                Bucket: MulterProvider.BUCKET,
                Key: `profile/${targetImageValue}`,
            }),
        );
    };
}
