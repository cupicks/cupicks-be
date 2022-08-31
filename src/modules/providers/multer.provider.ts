import * as multer from "multer";
import * as multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import path from "path";

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

    public uploadSingle() {
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
                contentType: multerS3.AUTO_CONTENT_TYPE,
                key(req, file, done) {
                    done(null, `profile/${Date.now()}${path.basename(file.originalname)}`);
                },
            }),
            fileFilter(req, file, done) {
                if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
                    done(null, true);
                } else {
                    // 에러 처리 추후 고민
                    return done(new Error("error"));
                }
            },
            limits: { fileSize: 5 * 1024 * 1024 },
        });
    }
}
