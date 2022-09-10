import { MessageRejected, SendEmailCommandOutput, SES } from "@aws-sdk/client-ses";
import { BadRequestException, ISesConfigEnv, UnkownError, UnkownTypeError } from "../../models/_.loader";

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
    static SES_SENDER_EMAIL: string;
    static SERVER_URL_WITH_PORT: string;

    static init(
        { SES_API_VERSION, SES_API_REGION, SES_ACCESS_KEY, SES_SECRET_KEY, SES_SENDER_EMAIL }: ISesConfigEnv,
        SERVER_URL_WITH_PORT: string,
    ) {
        if (this.isInit === true) return;

        this.ses = new SES({
            apiVersion: SES_API_VERSION,
            region: SES_API_REGION,
            credentials: {
                accessKeyId: SES_ACCESS_KEY,
                secretAccessKey: SES_SECRET_KEY,
            },
        });

        this.SES_SENDER_EMAIL = SES_SENDER_EMAIL;
        this.SERVER_URL_WITH_PORT = SERVER_URL_WITH_PORT;

        return;
    }

    public getSesInstance(): SES {
        return AwsSesProvider.ses;
    }

    /** @deprecated */
    public getRandomSixDigitsVerifiedCode(): string {
        let emailVerifyCode = "";
        for (let i = 0; i < 6; i++) {
            emailVerifyCode += Math.floor(Math.random() * 10);
        }
        return emailVerifyCode;
    }

    public async sendVerifyCode(toEmail: string, emailVerifyCode: string): Promise<SendEmailCommandOutput> {
        const ses = this.getSesInstance();
        try {
            return await ses.sendEmail({
                Source: AwsSesProvider.SES_SENDER_EMAIL,
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
        } catch (err) {
            if (err instanceof MessageRejected)
                throw new BadRequestException(`${toEmail} 은 메일 수신이 불가능한 이메일입니다.`);
            else if (err instanceof Error) throw new UnkownError(`${err.name}, ${err.message}`);
            else throw new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
        }
    }

    public async sendTempPassword(toEmail: string, tempPassword: string, resetPasswordToken: string) {
        const ses = this.getSesInstance();
        try {
            const url = `${AwsSesProvider.SERVER_URL_WITH_PORT}/api/auth/reset-password?resetPasswordToken=${resetPasswordToken}`;

            return await ses.sendEmail({
                Source: AwsSesProvider.SES_SENDER_EMAIL,
                Destination: {
                    ToAddresses: [toEmail],
                },
                ReplyToAddresses: [],
                Message: {
                    Body: {
                        Html: {
                            Charset: "UTF-8",
                            Data: `
                                <div>
                                    <h1 style="color: red">임시 비밀번호 : ${tempPassword}</h1>
                                    <br>
                                    <a href="${url}";>비밀번호 확인</a>
                                </div>
                            `,
                        },
                    },
                    Subject: {
                        Charset: "UTF-8",
                        Data: `Cupicks! 에서 임시 비밀번호가 발급되었습니다.`,
                    },
                },
            });
        } catch (err) {
            if (err instanceof MessageRejected)
                throw new BadRequestException(`${toEmail} 은 메일 수신이 불가능한 이메일입니다.`);
            else if (err instanceof Error) throw new UnkownError(`${err.name}, ${err.message}`);
            else throw new UnkownTypeError(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(err)}`);
        }
    }
}
