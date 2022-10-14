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
    static FROTN_REDIRECT_URL_WITHOUT_PORT: string;

    static init(
        { SES_API_VERSION, SES_API_REGION, SES_ACCESS_KEY, SES_SECRET_KEY, SES_SENDER_EMAIL }: ISesConfigEnv,
        SERVER_URL_WITH_PORT: string,
        FROTN_REDIRECT_URL_WITHOUT_PORT: string,
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
        this.FROTN_REDIRECT_URL_WITHOUT_PORT = FROTN_REDIRECT_URL_WITHOUT_PORT;

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

    public async sendVerifyCode(
        toEmail: string,
        emailVerifyCode: string,
        remainingEmailSentChance: number,
        dateTimeValues: {
            publishedDate: string;
            expiredDate: string;
        },
    ): Promise<SendEmailCommandOutput> {
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
                            Data: `
                                <body style="margin: 0">
                                    <style>
                                    @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap");
                                    body {
                                        font-family: "Noto Sans KR", sans-serif;
                                        color: #393939;
                                        line-height: 1.6;
                                    }
                                    </style>
                                    <div class="wrap">
                                    <header
                                        style="
                                        height: 156px;
                                        background-color: #393939;
                                        color: #fff;
                                        text-align: center;
                                        "
                                        >
                                        <img
                                            src="https://dusuna.cafe24.com/IMG/cupick_logo_email.png"
                                            style="width: 120px; height: auto; padding-top: 66px"
                                            alt="커픽 로고"
                                            />
                                    </header>
                                    <section
                                        class="title"
                                        style="
                                        max-width: 1000px;
                                        margin: 0 auto;
                                        padding: 37px 25px 27px;
                                        border-bottom: 2px solid #cdcdcd;
                                        "
                                    >
                                        <h1>Cupick 회원가입을 위한 인증번호입니다.</h1>
                                        <h4>아래의 인증번호를 확인하여 이메일 주소 인증을 확인해주세요.</h4>
                                    </section>
                                    <section
                                        class="desc"
                                        style="
                                        max-width: 1000px;
                                        margin: 0 auto;
                                        text-align: center;
                                        padding: 40px 0;
                                        border-bottom: 2px solid #cdcdcd;
                                        "
                                    >
                                        <p>cupick 계정 : ${toEmail}</p>
                                        <p>인증번호 : <strong>${emailVerifyCode}</strong></p>
                                        <p>남은 횟수 : ${remainingEmailSentChance}회</p>
                                        <p>발급 시간 : ${dateTimeValues.publishedDate}</p>
                                        <p>만료 시간 : ${dateTimeValues.expiredDate}</p>
                                    </section>
                                    <section
                                        class="info"
                                        style="
                                        max-width: 1000px;
                                        margin: 0 auto;
                                        padding: 37px 2px 27px;
                                        border-bottom: 2px solid #cdcdcd;
                                        "
                                    >
                                        <p>인증번호는 메일이 전송된 시점부터 3분 동안만 유효합니다.</p>
                                        <p>본 메일은 발신 전용입니다. 감사합니다.</p>
                                    </section>
                                    </div>
                                </body>
                            `,
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

    public async sendTempPassword(
        toEmail: string,
        tempPassword: string,
        resetPasswordToken: string,
        remainingEmailSentChance: number,
        dateTimeValues: {
            publishedDate: string;
            expiredDate: string;
        },
    ) {
        const ses = this.getSesInstance();
        try {
            const url = `${AwsSesProvider.FROTN_REDIRECT_URL_WITHOUT_PORT}/confirm-password?resetPasswordToken=${resetPasswordToken}`;

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
                                <body style="margin: 0">
                                    <style>
                                    @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap");
                                    body {
                                        font-family: "Noto Sans KR", sans-serif;
                                        color: #393939;
                                        line-height: 1.6;
                                    }
                                    </style>
                                    <div class="wrap">
                                    <header
                                        style="
                                        height: 156px;
                                        background-color: #393939;
                                        color: #fff;
                                        text-align: center;
                                        "
                                        >
                                        <img
                                            src="https://dusuna.cafe24.com/IMG/cupick_logo_email.png"
                                            style="width: 120px; height: auto; padding-top: 66px"
                                            alt="커픽 로고"
                                            />
                                    </header>
                                    <section
                                        class="title"
                                        style="
                                        max-width: 1000px;
                                        margin: 0 auto;
                                        padding: 37px 25px 27px;
                                        border-bottom: 2px solid #cdcdcd;
                                        "
                                    >
                                        <h1>Cupick 임시 비밀번호 발급을 위한 메일입니다.</h1>
                                        <h4>안녕하세요, Cupick 고객님. 요청하신 임시 비밀번호는 다음과 같습니다.</h4>
                                    </section>
                                    <section
                                        class="desc"
                                        style="
                                        max-width: 1000px;
                                        margin: 0 auto;
                                        text-align: center;
                                        padding: 40px 0;
                                        border-bottom: 2px solid #cdcdcd;
                                        "
                                    >
                                        <p>cupick 계정 : ${toEmail}</p>
                                        <p>임시 비밀번호 : <strong>${tempPassword}</strong></p>
                                        <p>남은 횟수 : ${remainingEmailSentChance}회</p>
                                        <p>발급 시간 : ${dateTimeValues.publishedDate}</p>
                                        <p>만료 시간 : ${dateTimeValues.expiredDate}</p>
                                        <a
                                            href="${url}"
                                            style="
                                            display: inline-block;
                                            text-decoration: none;
                                            color: #fff;
                                            background-color: #393939;
                                            border: none;
                                            border-radius: 50px;
                                            padding: 15px 25px;
                                            margin-top: 40px;
                                            "
                                        >
                                            비밀번호 바로 변경하기
                                        </a>
                                    </section>
                                    <section
                                        class="info"
                                        style="
                                        max-width: 1000px;
                                        margin: 0 auto;
                                        padding: 37px 2px 27px;
                                        border-bottom: 2px solid #cdcdcd;
                                        "
                                    >
                                        <p>임시 비밀번호는 메일이 전송된 시점부터 <strong>48시간만 유효합니다.<strong></p>
                                        <p>임시 비밀번호를 사용해서 로그인 하신 후에 바로 비밀번호를 변경하셔야</p>
                                        <p>정상적으로 로그인이 가능합니다.</p>
                                        <br>
                                        <p>본 메일은 발신 전용입니다. 감사합니다.</p>
                                    </section>
                                    </div>
                                </body>
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
