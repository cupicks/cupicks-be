import { RequestHandler } from "express";

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

import { IS3ConfigEnv } from "models/_.loader";
import { UuidProvider } from "../_.loader";

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
                    const saveFileName = new UuidProvider().getUuid();
                    const ext = file.mimetype.split("/")[1];

                    done(null, `${path}/${saveFileName}` + "." + ext);
                },
            }),
            fileFilter(req, file, done) {
                const ext = file.mimetype.split("/")[1];

                if (!["jpg", "jpeg", "png"].includes(ext)) {
                    return done(new Error("지원하는 이미지 포맷은 JPG / JPEG / PNG 형식입니다."));
                }

                done(null, true);
            },
            limits: { fileSize: 1 * 1024 * 1024 },
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

        const bucketParams = {
            Bucket: MulterProvider.BUCKET,
            Key: `${path}/${targetImageValue}`,
        };

        return await s3.send(new DeleteObjectCommand(bucketParams));
    };
}
