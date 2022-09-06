import { SES } from "@aws-sdk/client-ses";
import { ISesConfigEnv } from "../../models/_.loader";

/**
 * References
 *
 * IAM for AWS SES : https://docs.aws.amazon.com/ses/latest/dg/control-user-access.html
 * Lib for AWS SES : https://www.npmjs.com/package/@aws-sdk/client-ses
 * Docs for AWS SES : https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/ses-examples-sending-email.html
 *
 * Error
 * 1. SignatureDoesNotMatch - https://github.com/aws/aws-sdk-js/issues/1443
 * 2. InvalidParameterValue - https://docs.aws.amazon.com/fr_fr/ses/latest/APIReference/CommonErrors.html
 */
export class AwsSesProvider {
    static isInit = false;
    static ses: SES;

    static init({ SES_API_VERSION, SES_API_REGION, SES_ACCESS_KEY, SES_SECRET_KEY }: ISesConfigEnv) {
        if (this.isInit === true) return;

        this.ses = new SES({
            apiVersion: SES_API_VERSION,
            region: SES_API_REGION,
            credentials: {
                accessKeyId: SES_ACCESS_KEY,
                secretAccessKey: SES_SECRET_KEY,
            },
        });
        return;
    }

    public getSesInstance(): SES {
        return AwsSesProvider.ses;
    }

    public sendVerifyCode(toEmail: string, emailVerifyCode: string) {
        const ses = this.getSesInstance();
        ses.sendEmail({
            Source: "workstation19961002@gmail.com",
            Destination: {
                ToAddresses: [toEmail],
            },
            ReplyToAddresses: [],
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `다음의 인증번호 [${emailVerifyCode}] 를 입력해주세요.`,
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Cupicks! 에서 이메일 중복확인이 실행되었습니다.`,
                },
            },
        });
    }
}
