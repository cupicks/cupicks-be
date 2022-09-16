import { faker } from "@faker-js/faker";
import { ConfirmEmailDto } from "../../../src/models/dtos/user/confirm.email.dto";
import { ConfirmNicknameDto } from "../../../src/models/dtos/user/confirm.nickname.dto";
import { ConfirmPasswordDto } from "../../../src/models/dtos/user/confirm.password.dto";
import { EditProfileDto } from "../../../src/models/dtos/user/edit.profile.dto";
import { PublishTokenDto } from "../../../src/models/dtos/user/publish.token.dto";
import { SendEmailDto } from "../../../src/models/dtos/user/send.email.dto";
import { SignupUserDto } from "../../../src/models/dtos/user/signup.user.dto";
import { SigninUserDto } from "../../../src/models/dtos/user/singin.user.dto";

export class UserDtoFixtureProvider {
    /**
     * - 매개변수가 없으면, 성공할 수 있는 값만 반환합니다.
     * - 매개변수가 있으면, 실패할 수 있는 값을 수동으로 넣을 수 있습니다.
     */
    public getConfirmEmailDto(email?: string, emailVerifyCode?: string): ConfirmEmailDto {
        return new ConfirmEmailDto({
            email: email ?? faker.internet.email(),
            emailVerifyCode:
                emailVerifyCode ??
                faker.random.numeric(6, {
                    allowLeadingZeros: true,
                }),
        });
    }
    /**
     * - 매개변수가 없으면, 성공할 수 있는 값만 반환합니다.
     * - 매개변수가 있으면, 실패할 수 있는 값을 수동으로 넣을 수 있습니다.
     */
    public getConfirmNicknameDto(email?: string, nickname?: string): ConfirmNicknameDto {
        return new ConfirmNicknameDto({
            email: email ?? faker.internet.email(),
            nickname: nickname ?? faker.internet.userName().substring(0, 10),
        });
    }
    /**
     * - 매개변수가 없으면, 성공할 수 있는 값만 반환합니다.
     * - 매개변수가 있으면, 실패할 수 있는 값을 수동으로 넣을 수 있습니다.
     */
    public getConfirmPasswordDto(userId?: number, password?: string): ConfirmPasswordDto {
        return new ConfirmPasswordDto({
            userId: userId ?? +faker.random.numeric(9),
            password: password ?? faker.internet.password().padStart(8, "a").substring(0, 14) + "@",
        });
    }
    /**
     * - 매개변수가 없으면, 성공할 수 있는 값만 반환합니다.
     * - 매개변수가 있으면, 실패할 수 있는 값을 수동으로 넣을 수 있습니다.
     */
    public getEditProfileDto(userId?: number, nickname?: string, imageUrl?: string, password?: string): EditProfileDto {
        return new EditProfileDto({
            userId: userId ?? +faker.random.numeric(9),
            nickname: nickname ?? faker.internet.userName().substring(0, 10),
            imageUrl: imageUrl ?? faker.internet.url(),
            password: password ?? faker.internet.password().padStart(8, "a").substring(0, 14) + "@",
        });
    }
    /**
     * - 매개변수가 없으면, 성공할 수 있는 값만 반환합니다.
     * - 매개변수가 있으면, 실패할 수 있는 값을 수동으로 넣을 수 있습니다.
     */
    public getPublishTokenDto(token?: string): PublishTokenDto {
        return new PublishTokenDto(token ?? faker.word.noun());
    }
    /**
     * - 매개변수가 없으면, 성공할 수 있는 값만 반환합니다.
     * - 매개변수가 있으면, 실패할 수 있는 값을 수동으로 넣을 수 있습니다.
     */
    public getSendEmailDto(email?: string): SendEmailDto {
        return new SendEmailDto({
            email: email ?? faker.internet.email(),
        });
    }
    /**
     * - 매개변수가 없으면, 성공할 수 있는 값만 반환합니다.
     * - 매개변수가 있으면, 실패할 수 있는 값을 수동으로 넣을 수 있습니다.
     */
    public getSignupUserDto(
        email?: string,
        emailVerifyToken?: string,
        nickname?: string,
        nicknameVerifyToken?: string,
        imageUrl?: string,
        password?: string,
    ): SignupUserDto {
        return new SignupUserDto({
            email: email ?? faker.internet.email(),
            emailVerifyToken: emailVerifyToken ?? faker.word.noun(),
            nickname: nickname ?? faker.internet.userName().substring(0, 10),
            nicknameVerifyToken: nicknameVerifyToken ?? faker.word.noun(),
            imageUrl: imageUrl ?? faker.internet.url(),
            password: password ?? faker.internet.password().padStart(8, "a").substring(0, 14) + "@",
        });
    }
    /**
     * - 매개변수가 없으면, 성공할 수 있는 값만 반환합니다.
     * - 매개변수가 있으면, 실패할 수 있는 값을 수동으로 넣을 수 있습니다.
     */
    public getSigninUserDto(email?: string, password?: string): SigninUserDto {
        return new SigninUserDto({
            email: email ?? faker.internet.email(),
            password: password ?? faker.internet.password().padStart(8, "a").substring(0, 14) + "@",
        });
    }
}
