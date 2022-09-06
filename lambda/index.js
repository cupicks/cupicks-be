const aws = require("aws-sdk");
const sharp = require("sharp");

const s3 = new aws.S3();

exports.handler = async (event, context, done) => {
    const Bucket = event.Records[0].s3.bucket.name;
    const Key = event.Records[0].s3.object.key;
    const filename = Key.split("/")[Key.split("/").length - 1];
    const ext = Key.split(".")[Key.split(".").length - 1];
    const format = ext === "jpg" ? "jpeg" : ext;

    try {
        // 버퍼 형식으로 반환
        const s3Object = await s3.getObject({ Bucket, Key }).promise();

        // sharp 세부 설정
        // https://sharp.pixelplumbing.com/
        const resized = await sharp(s3Object.Body)
            .resize(200, 200, { fit: "inside" })
            .toFormat(format)
            .toBuffer();

        // 저장
        await s3.putObject(
            {
                Bucket,
                Key: `thumb/${filename}`,
                Body: resized,
            }
        ).promise();

        return done(null, `thumb/${filename}`);
    } catch (err) {
        return done(err);
    }
}