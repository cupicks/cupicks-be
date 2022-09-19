import { RequestHandler } from "express";
import path from "path";

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import * as multer from "multer";
import * as multerS3 from "multer-s3";

import { IS3ConfigEnv } from "models/_.loader";
import { ForBiddenException, CustomException, UnkownTypeError } from "../../models/_.loader";

type ProfileImagePath = "profile" | "profile-resized";
type CommentImagePath = "comment" | "comment-resized";
type ImagePath = ProfileImagePath | CommentImagePath;

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
    static uploadImageProfile: RequestHandler = (req, res, next) => {
        return this.uploadImage("lee").single("imageValue")(req, res, next);
    };

    static uploadImageComment: RequestHandler = (req, res, next) => {
        return this.uploadImage("comment").single("imageValue")(req, res, next);
    };

    static uploadImage = (path: string) => {
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
                    done(null, `${path}/${Date.now()}${file.originalname}`);
                },
            }),
            fileFilter(req, file, done) {
                const ext = file.mimetype.split("/")[1];

                if (!["jpg", "jpeg", "png"].includes(ext)) {
                    return done(new Error("FILE EXTENSION ERROR"));
                }

                done(null, true);
            },
            limits: { fileSize: 5 * 1024 * 1024 },
        });
    };

    static deleteImage = async (targetImageValue: string, path: ImagePath) => {
        const s3 = new S3Client({
            credentials: {
                accessKeyId: MulterProvider.S3_ACCESS_KEY,
                secretAccessKey: MulterProvider.S3_SECRET_KEY,
            },
            region: MulterProvider.REGION,
        });

        // path: profile || comment 폴더
        // targetImageValue = 삭제될 이미지 값 || 수정 후 기존 이미지 값
        const bucketParams = {
            Bucket: MulterProvider.BUCKET,
            Key: `${path}/${targetImageValue}`,
        };

        return await s3.send(new DeleteObjectCommand(bucketParams));
    };

    // public errorHandler = (err: unknown): CustomException => {
    //     if (err instanceof CustomException) return err;
    //     else if (err instanceof Error) return new ForBiddenException(err.message, "FILE EXTENSION ERROR")
    //     else return new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
    // };
}
