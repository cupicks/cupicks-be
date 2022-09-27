import { faker } from "@faker-js/faker";
import { ERecipeCategory } from "../../../../../src/models/enums/e.recipe.category";

import {
    SignupUserDto,
    SigninUserDto,
    LogoutUserDto,
    PublishTokenDto,
    ConfirmEmailDto,
    ConfirmNicknameDto,
    SendPasswordDto,
    ResetPasswordDto,
    SendEmailDto,
    UserDto,
} from "../../../../../src/models/_.loader";

export class UserDtoFixtureProvider {
    /**
     * - 매개변수가 없으면, 성공할 수 있는 값만 반환합니다.
     * - 매개변수가 있으면, 실패할 수 있는 값을 수동으로 넣을 수 있습니다.
     */
    public getSignupUserDto(
        emailVerifyToken?: string,
        nicknameVerifyToken?: string,
        imageUrl?: string,
        resizedUrl?: string,
        password?: string,
        favorCategory?: string,
        disfavorCategory?: string,
    ): SignupUserDto {
        return new SignupUserDto({
            emailVerifyToken: emailVerifyToken ?? faker.word.noun(),
            nicknameVerifyToken: nicknameVerifyToken ?? faker.word.noun(),
            imageUrl: imageUrl ?? faker.internet.url(),
            resizedUrl: resizedUrl ?? faker.internet.url(),
            password: password ?? faker.internet.password().padStart(8, "a").substring(0, 14) + "@",
            favorCategory: favorCategory,
            disfavorCategory: disfavorCategory,
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

    /**
     * - 매개변수가 없으면, 성공할 수 있는 값만 반환합니다.
     * - 매개변수가 있으면, 실패할 수 있는 값을 수동으로 넣을 수 있습니다.
     */
    public getLogoutUserDto(refreshToken?: string): LogoutUserDto {
        return new LogoutUserDto({
            refreshToken: refreshToken ?? faker.word.noun(),
        });
    }

    /**
     * - 매개변수가 없으면, 성공할 수 있는 값만 반환합니다.
     * - 매개변수가 있으면, 실패할 수 있는 값을 수동으로 넣을 수 있습니다.
     */
    public getPublishTokenDto(refreshToken?: string): PublishTokenDto {
        return new PublishTokenDto({
            refreshToken: refreshToken ?? faker.word.noun(),
        });
    }

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
    public getConfirmNicknameDto(emailVerifyToken?: string, nickname?: string): ConfirmNicknameDto {
        return new ConfirmNicknameDto({
            emailVerifyToken: emailVerifyToken ?? faker.word.noun(),
            nickname: nickname ?? faker.internet.userName().substring(0, 10),
        });
    }

    /**
     * - 매개변수가 없으면, 성공할 수 있는 값만 반환합니다.
     * - 매개변수가 있으면, 실패할 수 있는 값을 수동으로 넣을 수 있습니다.
     */
    public getSendPasswordDto(email?: string): SendPasswordDto {
        return new SendPasswordDto({
            email: email ?? faker.internet.email(),
        });
    }

    /**
     * - 매개변수가 없으면, 성공할 수 있는 값만 반환합니다.
     * - 매개변수가 있으면, 실패할 수 있는 값을 수동으로 넣을 수 있습니다.
     */
    public getResetPasswordDto(resetPasswordToken?: string): ResetPasswordDto {
        return new ResetPasswordDto({
            resetPasswordToken: resetPasswordToken ?? faker.word.noun(),
        });
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

    public getUserDto({
        userId,
        createdAt,
        disfavorCategory,
        favorCategory,
        email,
        imageUrl,
        nickname,
        resizedUrl,
        updatedAt,
    }: {
        userId?: number;
        email?: string;
        nickname?: string;
        imageUrl?: string;
        resizedUrl?: string;
        createdAt?: string;
        updatedAt?: string;
        favorCategory?: ERecipeCategory[];
        disfavorCategory?: ERecipeCategory[];
    }): UserDto {
        return new UserDto({
            userId: userId ?? 1,
            email: email ?? faker.internet.email(),
            nickname: nickname ?? faker.internet.userName().substring(0, 10),
            imageUrl: imageUrl ?? faker.internet.url(),
            resizedUrl: resizedUrl ?? faker.internet.url(),
            updatedAt: updatedAt ?? faker.date.recent().toString(),
            createdAt: createdAt ?? faker.date.recent().toString(),
            disfavorCategory: disfavorCategory ?? [ERecipeCategory.caffein, ERecipeCategory.lemon],
            favorCategory: favorCategory ?? [ERecipeCategory.milk, ERecipeCategory.syrup],
        });
    }
}
