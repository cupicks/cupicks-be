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
                                            alt="?????? ??????"
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
                                        <h1>Cupick ??????????????? ?????? ?????????????????????.</h1>
                                        <h4>????????? ??????????????? ???????????? ????????? ?????? ????????? ??????????????????.</h4>
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
                                        <p>cupick ?????? : ${toEmail}</p>
                                        <p>???????????? : <strong>${emailVerifyCode}</strong></p>
                                        <p>?????? ?????? : ${remainingEmailSentChance}???</p>
                                        <p>?????? ?????? : ${dateTimeValues.publishedDate}</p>
                                        <p>?????? ?????? : ${dateTimeValues.expiredDate}</p>
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
                                        <p>??????????????? ????????? ????????? ???????????? 3??? ????????? ???????????????.</p>
                                        <p>??? ????????? ?????? ???????????????. ???????????????.</p>
                                    </section>
                                    </div>
                                </body>
                            `,
                        },
                    },
                    Subject: {
                        Charset: "UTF-8",
                        Data: `Cupicks! ?????? ????????? ??????????????? ?????????????????????.`,
                    },
                },
            });
        } catch (err) {
            if (err instanceof MessageRejected)
                throw new BadRequestException(`${toEmail} ??? ?????? ????????? ???????????? ??????????????????.`);
            else if (err instanceof Error) throw new UnkownError(`${err.name}, ${err.message}`);
            else throw new UnkownTypeError(`??? ??? ?????? ????????? ?????????????????????. ?????? : ${JSON.stringify(err)}`);
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
                                            alt="?????? ??????"
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
                                        <h1>Cupick ?????? ???????????? ????????? ?????? ???????????????.</h1>
                                        <h4>???????????????, Cupick ?????????. ???????????? ?????? ??????????????? ????????? ????????????.</h4>
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
                                        <p>cupick ?????? : ${toEmail}</p>
                                        <p>?????? ???????????? : <strong>${tempPassword}</strong></p>
                                        <p>?????? ?????? : ${remainingEmailSentChance}???</p>
                                        <p>?????? ?????? : ${dateTimeValues.publishedDate}</p>
                                        <p>?????? ?????? : ${dateTimeValues.expiredDate}</p>
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
                                            ???????????? ?????? ????????????
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
                                        <p>?????? ??????????????? ????????? ????????? ???????????? <strong>48????????? ???????????????.<strong></p>
                                        <p>?????? ??????????????? ???????????? ????????? ?????? ?????? ?????? ??????????????? ???????????????</p>
                                        <p>??????????????? ???????????? ???????????????.</p>
                                        <br>
                                        <p>??? ????????? ?????? ???????????????. ???????????????.</p>
                                    </section>
                                    </div>
                                </body>
                            `,
                        },
                    },
                    Subject: {
                        Charset: "UTF-8",
                        Data: `Cupicks! ?????? ?????? ??????????????? ?????????????????????.`,
                    },
                },
            });
        } catch (err) {
            if (err instanceof MessageRejected)
                throw new BadRequestException(`${toEmail} ??? ?????? ????????? ???????????? ??????????????????.`);
            else if (err instanceof Error) throw new UnkownError(`${err.name}, ${err.message}`);
            else throw new UnkownTypeError(`??? ??? ?????? ????????? ?????????????????????. ?????? : ${JSON.stringify(err)}`);
        }
    }
}
