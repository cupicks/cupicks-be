// sut
import { AuthService } from "../../../../src/routes/services/auth.service";

// arrange
import { TNODE_ENV } from "../../../../src/constants/_.loader";
import {
    BadRequestException,
    ConfirmEmailDto,
    ConfirmNicknameDto,
    ConflictException,
    Env,
    ForBiddenException,
    IUserPacket,
    IUserVerifyListPacket,
    LogoutUserDto,
    NotFoundException,
    PublishTokenDto,
    ResetPasswordDto,
    SendEmailDto,
    SigninUserDto,
    SignupUserDto,
    UserDto,
} from "../../../../src/models/_.loader";
import {
    AwsSesProvider,
    BcryptProvider,
    EnvProvider,
    JwtProvider,
    MulterProvider,
} from "../../../../src/modules/_.loader";
import * as jwtLib from "jsonwebtoken";

// arrange as mocking
import { mockModule } from "../../../_.fake.datas/mocks/_.loader";
import { UserDtoFixtureProvider, PacketFixtureProvider } from "../../../_.fake.datas/fixture/_.exporter";
import { Dayjs } from "dayjs";

jest.mock("../../../../src/modules/providers/mysql.provider", () => {
    return {
        MysqlProvider: jest.fn().mockImplementation(() => mockModule.Providers.MockMysqlProvider),
    };
});

describe("Auth Service Test", /**
 * AuthService 에 대한 단위 테스트의 주요 목적은 다음과 같습니다.
 *
 * 1. AuthService 가 선언되었는 지 여부
 * 2. AuthService 의 `의존성의 수` 와 `메서드의 수` 확인
 * 3. AuthService.prototype.method 의 내부 분기점 확인
 *      1. 실패할 경우, 재정의 되어 있는 CustomException 이 제대로 throw 되는 지 확인
 *      2. 성공할 경우, 올바른 반환값이 return 되는 지 확인
 *
 * @since 2022-09-27
 */ () => {
    let sutAuthService: AuthService;
    let userDtoFixtureProvider: UserDtoFixtureProvider;
    let packetFixtureProvider: PacketFixtureProvider;
    let MODE: TNODE_ENV, ENV: Env;

    beforeAll(async () => {
        userDtoFixtureProvider = new UserDtoFixtureProvider();
        packetFixtureProvider = new PacketFixtureProvider();

        MODE = "test";
        EnvProvider.init(MODE);
        ENV = new EnvProvider().getEnvInstance();

        // await MysqlProvider.init(ENV.MYSQL);
        JwtProvider.init(ENV.JWT);
        BcryptProvider.init(ENV.SALT);
        MulterProvider.init(ENV.S3);
        AwsSesProvider.init(ENV.SES, ENV.URL.SERVER_URL_WITH_PORT);

        sutAuthService = new AuthService();
    });

    beforeEach(() => {
        sutAuthService["mysqlProvider"].getConnection = mockModule.Providers.getMockConnection;
    });

    it("AuthService must be defined", () => expect(AuthService).toBeDefined());
    it("AuthService.prototype contain 9 dependencies and 9 methods", () => {
        expect(Object.keys(sutAuthService).length).toBe(18);

        expect(sutAuthService["jwtProvider"]).toBeDefined();
        expect(sutAuthService["mysqlProvider"]).toBeDefined();
        expect(sutAuthService["sesProvider"]).toBeDefined();
        expect(sutAuthService["bcryptProvider"]).toBeDefined();
        expect(sutAuthService["dayjsProvider"]).toBeDefined();

        expect(sutAuthService["randomGenerator"]).toBeDefined();

        expect(sutAuthService["authRepository"]).toBeDefined();
        expect(sutAuthService["authVerifyListRepository"]).toBeDefined();
        expect(sutAuthService["userCategoryRepository"]).toBeDefined();

        expect(sutAuthService.signup).toBeDefined();
        expect(typeof sutAuthService.signup).toBe("function");

        expect(sutAuthService.signin).toBeDefined();
        expect(typeof sutAuthService.signin).toBe("function");

        expect(sutAuthService.logout).toBeDefined();
        expect(typeof sutAuthService.logout).toBe("function");

        expect(sutAuthService.publishToken).toBeDefined();
        expect(typeof sutAuthService.publishToken).toBe("function");

        expect(sutAuthService.sendEmail).toBeDefined();
        expect(typeof sutAuthService.sendEmail).toBe("function");

        expect(sutAuthService.confirmEmailCode).toBeDefined();
        expect(typeof sutAuthService.confirmEmailCode).toBe("function");

        expect(sutAuthService.confirmNickname).toBeDefined();
        expect(typeof sutAuthService.confirmNickname).toBe("function");

        expect(sutAuthService.sendPassword).toBeDefined();
        expect(typeof sutAuthService.sendPassword).toBe("function");

        expect(sutAuthService.resetPassword).toBeDefined();
        expect(typeof sutAuthService.resetPassword).toBe("function");
    });

    describe("AuthService.prototype.signup", () => {
        let signupUserDto: SignupUserDto;
        let email: string, nickname: string;
        let emailVerifyToken: string, nicknameVerifyToken: string;

        beforeEach(() => {
            email = "sample_email";
            nickname = "sample_nickname";

            sutAuthService["bcryptProvider"].hashPassword = jest.fn((password: string): string => password);

            emailVerifyToken = sutAuthService["jwtProvider"].signEmailVerifyToken({ type: "EmailVerifyToken", email });
            nicknameVerifyToken = sutAuthService["jwtProvider"].signNicknameVerifyToken({
                type: "NicknameVerifyToken",
                nickname,
            });

            signupUserDto = userDtoFixtureProvider.getSignupUserDto(emailVerifyToken, nicknameVerifyToken);
        });

        it("should throw AUTH-004, 이메일 및 닉네임 인증 절차를 진행하지 않은 사용자입니다.", async () => {
            const jestFunc = jest.fn();
            jestFunc.mockReturnValue(null);

            sutAuthService["authVerifyListRepository"].findVerifyListByEmail = jestFunc;

            try {
                await sutAuthService.signup(signupUserDto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(BadRequestException);

                expect(err instanceof BadRequestException && err.statusCode).toBe(400);
                expect(err instanceof BadRequestException && err.message).toBe(
                    `${email} 이메일 및 닉네임 인증 절차를 진행하지 않은 사용자입니다.`,
                );
                expect(err instanceof BadRequestException && err.errorCode).toBe("AUTH-004");
            }
        });

        it("should throw AUTH-005, 등록되지 않은 emailVerifyToken 입니다.", async () => {
            const returnUserVerifyList: IUserVerifyListPacket = {
                constructor: {
                    name: "RowDataPacket",
                },
                emailVerifiedToken: "wrong_token",
                nicknameVerifiedToken: nicknameVerifyToken,
                email,
                nickname,
                userVerifyListId: 1,
                currentEmailSentCount: 1,
                emailVerifiedCode: "123456",
                emailVerifiedDate: "sample_date",
                nicknameVerifiedDate: "sample_date",
                emailSentExceedingDate: "sample_date",
                isVerifiedEmail: 1,
                isVerifiedNickname: 1,
                isExeededOfEmailSent: 1,
            };

            const jestFunc = jest.fn();
            jestFunc.mockReturnValue(returnUserVerifyList);
            sutAuthService["authVerifyListRepository"].findVerifyListByEmail = jestFunc;

            try {
                await sutAuthService.signup(signupUserDto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(BadRequestException);

                expect(err instanceof BadRequestException && err.statusCode).toBe(400);
                expect(err instanceof BadRequestException && err.message).toBe(
                    `등록되지 않은 emailVerifyToken 입니다.`,
                );
                expect(err instanceof BadRequestException && err.errorCode).toBe("AUTH-005");
            }
        });

        it("should throw AUTH-006, 등록되지 않은 nicnameVerifyToken 입니다.", async () => {
            const returnUserVerifyList: IUserVerifyListPacket = {
                constructor: {
                    name: "RowDataPacket",
                },
                emailVerifiedToken: emailVerifyToken,
                nicknameVerifiedToken: "wrong_token",
                email,
                nickname,
                userVerifyListId: 1,
                currentEmailSentCount: 1,
                emailVerifiedCode: "123456",
                emailVerifiedDate: "sample_date",
                nicknameVerifiedDate: "sample_date",
                emailSentExceedingDate: "sample_date",
                isVerifiedEmail: 1,
                isVerifiedNickname: 1,
                isExeededOfEmailSent: 1,
            };

            const jestFunc = jest.fn();
            jestFunc.mockReturnValue(returnUserVerifyList);
            sutAuthService["authVerifyListRepository"].findVerifyListByEmail = jestFunc;

            try {
                await sutAuthService.signup(signupUserDto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(BadRequestException);

                expect(err instanceof BadRequestException && err.statusCode).toBe(400);
                expect(err instanceof BadRequestException && err.message).toBe(
                    "등록되지 않은 nicnameVerifyToken 입니다.",
                );
                expect(err instanceof BadRequestException && err.errorCode).toBe("AUTH-006");
            }
        });

        it("should throw AUTH-001-01, ${email} 은 사용 중입니다.", async () => {
            const returnUserVerifyList: IUserVerifyListPacket = {
                constructor: {
                    name: "RowDataPacket",
                },
                emailVerifiedToken: emailVerifyToken,
                nicknameVerifiedToken: nicknameVerifyToken,
                email,
                nickname,
                userVerifyListId: 1,
                currentEmailSentCount: 1,
                emailVerifiedCode: "123456",
                emailVerifiedDate: "sample_date",
                nicknameVerifiedDate: "sample_date",
                emailSentExceedingDate: "sample_date",
                isVerifiedEmail: 1,
                isVerifiedNickname: 1,
                isExeededOfEmailSent: 1,
            };

            const jestFunc = jest.fn();
            jestFunc.mockReturnValue(returnUserVerifyList);
            sutAuthService["authVerifyListRepository"].findVerifyListByEmail = jestFunc;

            const jestFunc2 = jest.fn();
            jestFunc2.mockReturnValue(true);
            sutAuthService["authRepository"].isExistsByEmail = jestFunc2;

            try {
                await sutAuthService.signup(signupUserDto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(ConflictException);

                expect(err instanceof ConflictException && err.statusCode).toBe(409);
                expect(err instanceof ConflictException && err.message).toBe(`${email} 은 사용 중입니다.`);
                expect(err instanceof ConflictException && err.errorCode).toBe("AUTH-001-01");
            }
        });

        it("should return new UserDto", async () => {
            const returnUserVerifyList: IUserVerifyListPacket = {
                constructor: {
                    name: "RowDataPacket",
                },
                emailVerifiedToken: emailVerifyToken,
                nicknameVerifiedToken: nicknameVerifyToken,
                email,
                nickname,
                userVerifyListId: 1,
                currentEmailSentCount: 1,
                emailVerifiedCode: "123456",
                emailVerifiedDate: "sample_date",
                nicknameVerifiedDate: "sample_date",
                emailSentExceedingDate: "sample_date",
                isVerifiedEmail: 1,
                isVerifiedNickname: 1,
                isExeededOfEmailSent: 1,
            };

            const jestFunc = jest.fn();
            jestFunc.mockReturnValue(returnUserVerifyList);
            sutAuthService["authVerifyListRepository"].findVerifyListByEmail = jestFunc;

            const jestFunc2 = jest.fn();
            jestFunc2.mockReturnValue(false);
            sutAuthService["authRepository"].isExistsByEmail = jestFunc2;

            const jestFunc3 = jest.fn();
            jestFunc3.mockReturnValue("hello");
            sutAuthService["dayjsProvider"].changeToProvidedFormat = jestFunc3;
            sutAuthService["dayjsProvider"].getDayjsInstance = jest.fn();
            sutAuthService["dayjsProvider"].getDayabaseFormat = jest.fn();

            const jestFunc4 = jest.fn();
            jestFunc4.mockReturnValue(123456);
            sutAuthService["authRepository"].createUser = jestFunc4;
            sutAuthService["userCategoryRepository"].createFavorCategoryList = jest.fn();
            sutAuthService["userCategoryRepository"].createDisfavorCategoryList = jest.fn();

            const userDto = await sutAuthService.signup(signupUserDto);

            sutAuthService["userCategoryRepository"].createFavorCategoryList = jest.fn();
            sutAuthService["userCategoryRepository"].createDisfavorCategoryList = jest.fn();

            expect(userDto).toBeDefined();
            expect(userDto).toBeInstanceOf(UserDto);

            expect(sutAuthService["dayjsProvider"].changeToProvidedFormat).toBeCalled();
            expect(sutAuthService["dayjsProvider"].getDayjsInstance).toBeCalled();
            expect(sutAuthService["dayjsProvider"].getDayabaseFormat).toBeCalled();

            expect(sutAuthService["authRepository"].createUser).toBeCalled();
        });
    });

    describe("AuthService.prototype.signin", () => {
        let signinUserDto: SigninUserDto;
        let accessToken: string, refreshToken: string;
        let findedUser: IUserPacket;

        beforeEach(() => {
            signinUserDto = userDtoFixtureProvider.getSigninUserDto();
            accessToken = "sample_access_token";
            refreshToken = "sample_refresh_token";

            findedUser = packetFixtureProvider.getIUserPacket({});
        });

        it("should throw AUTH-002, ${email} 은 존재하지 않는 이메일입니다.", async () => {
            sutAuthService["authRepository"].findUserByEmail = jest.fn(async (): Promise<IUserPacket | null> => null);

            try {
                await sutAuthService.signin(signinUserDto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(NotFoundException);

                expect(err instanceof NotFoundException && err.statusCode).toBe(404);
                expect(err instanceof NotFoundException && err.message).toBe(
                    `${signinUserDto.email} 은 존재하지 않는 이메일입니다.`,
                );
                expect(err instanceof NotFoundException && err.errorCode).toBe("AUTH-002");
            }
        });

        it("should throw AUTH-003, ${email} 와 일치하지 않는 비밀번호 입니다.", async () => {
            sutAuthService["authRepository"].findUserByEmail = jest.fn(
                async (): Promise<IUserPacket | null> => findedUser,
            );
            sutAuthService["bcryptProvider"].comparedPassword = jest.fn(async (): Promise<boolean> => false);

            try {
                await sutAuthService.signin(signinUserDto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(ForBiddenException);

                expect(err instanceof ForBiddenException && err.statusCode).toBe(403);
                expect(err instanceof ForBiddenException && err.message).toBe(
                    `${signinUserDto.email} 와 일치하지 않는 비밀번호 입니다.`,
                );
                expect(err instanceof ForBiddenException && err.errorCode).toBe("AUTH-003");
            }
        });

        it("should return { accessToken: string, refreshToken: string }", async () => {
            sutAuthService["authRepository"].findUserByEmail = jest.fn(
                async (): Promise<IUserPacket | null> => findedUser,
            );
            sutAuthService["bcryptProvider"].comparedPassword = jest.fn(async (): Promise<boolean> => true);

            sutAuthService["jwtProvider"].signAccessToken = jest.fn((): string => accessToken);
            sutAuthService["jwtProvider"].signRefreshToken = jest.fn((): string => refreshToken);
            sutAuthService["authRepository"].updateUserRefreshToken = jest.fn();

            const response = await sutAuthService.signin(signinUserDto);

            expect(response).toBeDefined();

            expect(response.accessToken).toBeDefined();
            expect(response.accessToken).toBe(accessToken);
            expect(response.refreshToken).toBeDefined();
            expect(response.refreshToken).toBe(refreshToken);

            // calling

            expect(sutAuthService["authRepository"].findUserByEmail).toBeCalled();

            expect(sutAuthService["bcryptProvider"].comparedPassword).toBeCalled();

            expect(sutAuthService["jwtProvider"].signAccessToken).toBeCalled();
            expect(sutAuthService["jwtProvider"].signAccessToken).toBeCalledTimes(1);
            expect(sutAuthService["jwtProvider"].signAccessToken).toBeCalledWith({
                type: "AccessToken",
                userId: findedUser.userId,
                nickname: findedUser.nickname,
            });

            expect(sutAuthService["jwtProvider"].signRefreshToken).toBeCalled();
            expect(sutAuthService["jwtProvider"].signRefreshToken).toBeCalledTimes(1);
            expect(sutAuthService["jwtProvider"].signRefreshToken).toBeCalledWith({
                type: "RefreshToken",
                userId: findedUser.userId,
                nickname: findedUser.nickname,
                email: findedUser.email,
                // imageUrl: findedUser.imageUrl,
            });

            expect(sutAuthService["authRepository"].updateUserRefreshToken).toBeCalled();
        });
    });

    /**
     * 다음 테스트 그룹은 재검토가 필요합니다.
     */
    // describe("AuthService.prototype.logout", () => {

    //     let logoutUserDto: LogoutUserDto;
    //     let refreshTokenPayload: {
    //         type: 'RefreshToken',
    //         email: string,
    //         nickname: string,
    //         userId: number,
    //         imageUrl: string,
    //     }

    //     beforeEach(() => {
    //         logoutUserDto = userDtoFixtureProvider.getLogoutUserDto();
    //         refreshTokenPayload = {
    //             type: "RefreshToken",
    //             email: "sample_email",
    //             nickname: "sample_nickname",
    //             userId: 123456,
    //             imageUrl: "sample_image"
    //         }

    //         const jestFn = jest.fn();
    //         jestFn.mockRejectedValue(refreshTokenPayload)
    //         sutAuthService["jwtProvider"].decodeToken = jestFn;
    //     });

    //     it("should throw AUTH-007-02, 이미 탈퇴한 사용자의 RefreshToken 입니다.", async () => {

    //         sutAuthService["authRepository"].findUserById = jest.fn(async (): Promise<IUserPacket | null> => null);
    //         try {
    //             await sutAuthService.logout(logoutUserDto);
    //         } catch (err) {
    //             expect(err).toBeDefined();
    //             expect(err).toBeInstanceOf(NotFoundException);

    //             expect(err instanceof NotFoundException && err.statusCode).toBe(404);
    //             expect(err instanceof NotFoundException && err.message).toBe(
    //                 `이미 탈퇴한 사용자의 RefreshToken 입니다.`,
    //             );
    //             expect(err instanceof NotFoundException && err.errorCode).toBe("AUTH-007-02");
    //         }

    //     });
    // });

    // describe("AuthService.prototype.publishToken", () => {
    // });

    /**
     * 다음 테스트 그룹은 재검토가 필요합니다.
     */
    describe("AuthService.prototype.sendEmail", () => {
        let sendEmailDto: SendEmailDto;

        let mockDayJs: Dayjs;
        let mockVerifyCode: string;
        let mockIUserVerifyListPacket: IUserVerifyListPacket;

        beforeAll(() => {
            mockDayJs = sutAuthService["dayjsProvider"].getDayjsInstance();
            mockIUserVerifyListPacket = packetFixtureProvider.getIUserVerifyListPacket({
                emailVerifiedDate: new Date().toString(),
                nicknameVerifiedDate: new Date().toString(),
                emailSentExceedingDate: new Date().toString(),
            });
        });

        beforeEach(() => {
            sendEmailDto = userDtoFixtureProvider.getSendEmailDto();

            mockVerifyCode = "11111";
        });

        it("should throw AUTH-001-01, ${email} 은 이미 가입한 이메일입니다.", async () => {
            sutAuthService["authRepository"].isExistsByEmail = jest.fn(async (): Promise<boolean> => true);

            try {
                await sutAuthService.sendEmail(sendEmailDto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(ConflictException);

                expect(err instanceof ConflictException && err.statusCode).toBe(409);
                expect(err instanceof ConflictException && err.message).toBe(
                    `${sendEmailDto.email} 은 이미 가입한 이메일입니다.`,
                );
                expect(err instanceof ConflictException && err.errorCode).toBe("AUTH-001-01");
            }
        });

        /**
         * 이 테스트는 현재 랜덤한 기준으로 에러가 발생하고 있습니다.
         * @since 2022-09-29
         */
        // it(`(271 line) : userVerifyList is null
        //     should return { email: string, date: string, exceededDate: undefined }`, async () => {
        //     sutAuthService["authRepository"].isExistsByEmail = jest.fn(async (): Promise<boolean> => false);

        //     sutAuthService["dayjsProvider"].getDayjsInstance = jest.fn((): Dayjs => mockDayJs);
        //     sutAuthService["randomGenerator"].getRandomVerifyCode = jest.fn((): string => mockVerifyCode);
        //     sutAuthService["authVerifyListRepository"].findVerifyListByEmail = jest.fn(async (): Promise<IUserVerifyListPacket | null> => null);
        //     sutAuthService["authVerifyListRepository"].createVerifyListByEmailAndCode = jest.fn();

        //     sutAuthService["dayjsProvider"].getAddTime = jest.fn((): Dayjs => mockDayJs);
        //     sutAuthService["sesProvider"].sendVerifyCode = jest.fn();

        //     const result = await sutAuthService.sendEmail(sendEmailDto);

        //     // response

        //     expect(result.email).toBe(sendEmailDto.email);
        //     expect(result.date).toBeDefined();
        //     expect(result.exceededDate).not.toBeDefined();

        //     // calling

        //     expect(sutAuthService["authRepository"].isExistsByEmail).toBeCalled();
        //     expect(sutAuthService["dayjsProvider"].getDayjsInstance).toBeCalled();
        //     expect(sutAuthService["randomGenerator"].getRandomVerifyCode).toBeCalled();
        //     expect(sutAuthService["authVerifyListRepository"].findVerifyListByEmail).toBeCalled();
        //     expect(sutAuthService["authVerifyListRepository"].createVerifyListByEmailAndCode).toBeCalled();
        //     expect(sutAuthService["dayjsProvider"].getAddTime).toBeCalled();
        //     expect(sutAuthService["sesProvider"].sendVerifyCode).toBeCalled();

        // });

        /**
         * 이 테스트는 현재 랜덤한 기준으로 에러가 발생하고 있습니다.
         * @since 2022-09-29
         */
        // it(`(279 line) : userVerifyList is not null \n should throw AUTH-004-EXP-01, 사용자 이메일로 일일 이메일 제한 횟수 5회를 초과했어요! \n 24 시간 뒤에 다시 신청해주세요!`, async () => {

        //     sutAuthService["authRepository"].isExistsByEmail = jest.fn(async  (): Promise<boolean> => false);

        //     sutAuthService["dayjsProvider"].getDayjsInstance = jest.fn((): Dayjs => mockDayJs);
        //     sutAuthService["randomGenerator"].getRandomVerifyCode = jest.fn((): string => mockVerifyCode);
        //     sutAuthService["authVerifyListRepository"].findVerifyListByEmail = jest.fn(async (): Promise<IUserVerifyListPacket | null> => mockIUserVerifyListPacket);

        //     sutAuthService["dayjsProvider"].getDiffMIlliSeconds = jest.fn((): number => 30);

        //     try {
        //         await sutAuthService.sendEmail(sendEmailDto);
        //     } catch (err) {
        //         expect(err).toBeDefined();
        //         expect(err).toBeInstanceOf(BadRequestException);

        //         expect(err instanceof BadRequestException && err.statusCode).toBe(400);
        //         expect(err instanceof BadRequestException && err.message).toBe("사용자 이메일로 일일 이메일 제한 횟수 5회를 초과했어요!\n24 시간 뒤에 다시 신청해주세요!");
        //         expect(err instanceof BadRequestException && err.errorCode).toBe("AUTH-004-EXP-01");
        //         expect(err instanceof BadRequestException && err.errorResult).toEqual({
        //             date: "hello",
        //             exceededDate: {
        //               accessibleDate: "hello",
        //               lastSentDate: "hello",
        //             }
        //         });

        //     }
        // });
    });

    describe("AuthService.prototype.confirmEmailCode", () => {
        let confirmEmailDto: ConfirmEmailDto;

        beforeEach(() => {
            confirmEmailDto = userDtoFixtureProvider.getConfirmEmailDto();
        });

        it("should throw AUTH-001-01, ${email} 은 이미 가입한 이메일입니다.", async () => {
            sutAuthService["authRepository"].isExistsByEmail = jest.fn(async (): Promise<boolean> => true);

            try {
                await sutAuthService.confirmEmailCode(confirmEmailDto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(ConflictException);

                expect(err instanceof ConflictException && err.statusCode).toBe(409);
                expect(err instanceof ConflictException && err.message).toBe(
                    `${confirmEmailDto.email} 은 이미 가입한 이메일입니다.`,
                );
                expect(err instanceof ConflictException && err.errorCode).toBe("AUTH-001-01");
            }
        });

        it("should throw AUTH-004-01, ${email} 은 인증번호 발송 과정이 진행되지 않았습니다.", async () => {
            sutAuthService["authRepository"].isExistsByEmail = jest.fn(async (): Promise<boolean> => false);
            sutAuthService["authVerifyListRepository"].findVerifyListByEmail = jest.fn(
                async (): Promise<IUserVerifyListPacket | null> => null,
            );

            try {
                await sutAuthService.confirmEmailCode(confirmEmailDto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(BadRequestException);

                expect(err instanceof BadRequestException && err.statusCode).toBe(400);
                expect(err instanceof BadRequestException && err.message).toBe(
                    `${confirmEmailDto.email} 은 인증번호 발송 과정이 진행되지 않았습니다.`,
                );
                expect(err instanceof BadRequestException && err.errorCode).toBe("AUTH-004-01");
            }
        });

        it("should throw AUTH-004-02, 인증 번호가 틀렸습니다.", async () => {
            const emailVerifiedCodeInDto = +confirmEmailDto.emailVerifyCode;
            const isOverTen = emailVerifiedCodeInDto > 10;
            const wrongVerifiedCode = isOverTen
                ? `${emailVerifiedCodeInDto - 10}`.padStart(6, "0")
                : `${emailVerifiedCodeInDto + 10}`.padStart(6, "0");

            const mockIUserVerifyListPacket: IUserVerifyListPacket = packetFixtureProvider.getIUserVerifyListPacket({
                emailVerifiedCode: wrongVerifiedCode,
            });

            sutAuthService["authRepository"].isExistsByEmail = jest.fn(async (): Promise<boolean> => false);
            sutAuthService["authVerifyListRepository"].findVerifyListByEmail = jest.fn(
                async (): Promise<IUserVerifyListPacket | null> => mockIUserVerifyListPacket,
            );

            try {
                await sutAuthService.confirmEmailCode(confirmEmailDto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(BadRequestException);

                expect(err instanceof BadRequestException && err.statusCode).toBe(400);
                expect(err instanceof BadRequestException && err.message).toBe(`인증 번호가 틀렸습니다.`);
                expect(err instanceof BadRequestException && err.errorCode).toBe("AUTH-004-02");
            }
        });

        it("should return { emailVerifyToken: string }", async () => {
            const emailVerifiedToken = "sample_token";
            const mockIUserVerifyListPacket: IUserVerifyListPacket = packetFixtureProvider.getIUserVerifyListPacket({
                emailVerifiedCode: confirmEmailDto.emailVerifyCode,
            });

            sutAuthService["authRepository"].isExistsByEmail = jest.fn(async (): Promise<boolean> => false);
            sutAuthService["authVerifyListRepository"].findVerifyListByEmail = jest.fn(
                async (): Promise<IUserVerifyListPacket | null> => mockIUserVerifyListPacket,
            );

            sutAuthService["dayjsProvider"].getDayjsInstance = jest.fn();
            sutAuthService["jwtProvider"].signEmailVerifyToken = jest.fn((): string => emailVerifiedToken);
            sutAuthService["dayjsProvider"].changeToProvidedFormat = jest.fn();

            sutAuthService["authVerifyListRepository"].updateVerifyListByEmailAndEmailVerifyToken = jest.fn();
            sutAuthService["authVerifyListRepository"].reUpdateVerifyListByEmailAndEmailVerifyToken = jest.fn();

            const respone = await sutAuthService.confirmEmailCode(confirmEmailDto);

            expect(respone).toBeDefined();
            expect(respone.emailVerifyToken).toBe(emailVerifiedToken);
        });
    });

    describe("AuthService.prototype.confirmNickname", () => {
        let email: string;
        let emailVerifyToken: string;
        let confirmNicknameDto: ConfirmNicknameDto;

        beforeEach(() => {
            email = "sample_email";
            emailVerifyToken = new JwtProvider().signEmailVerifyToken({ email, type: "EmailVerifyToken" });
            confirmNicknameDto = userDtoFixtureProvider.getConfirmNicknameDto(emailVerifyToken);
        });

        it("should throw AUTH-001-02, ${nickname} 은 이미 가입한 닉네임입니다.", async () => {
            sutAuthService["authRepository"].isExistsByNickname = jest.fn(async (): Promise<boolean> => true);

            try {
                await sutAuthService.confirmNickname(confirmNicknameDto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(ConflictException);

                expect(err instanceof ConflictException && err.statusCode).toBe(409);
                expect(err instanceof ConflictException && err.message).toBe(
                    `${confirmNicknameDto.nickname} 은 이미 가입한 닉네임입니다.`,
                );
                expect(err instanceof ConflictException && err.errorCode).toBe("AUTH-001-02");
            }
        });

        it("should throw AUTH-004-03, ${nickname} 은 다른 사람이 중복 확인 중인 닉네임입니다.", async () => {
            sutAuthService["authRepository"].isExistsByNickname = jest.fn(async (): Promise<boolean> => false);
            sutAuthService["authVerifyListRepository"].isExistsByNicknameExceptEmail = jest.fn(
                async (): Promise<boolean> => true,
            );

            try {
                await sutAuthService.confirmNickname(confirmNicknameDto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(ConflictException);

                expect(err instanceof ConflictException && err.statusCode).toBe(409);
                expect(err instanceof ConflictException && err.message).toBe(
                    `${confirmNicknameDto.nickname} 은 다른 사람이 중복 확인 중인 닉네임입니다.`,
                );
                expect(err instanceof ConflictException && err.errorCode).toBe("AUTH-004-03");
            }
        });

        it("should throw AUTH-004-01, ${email} 은 인증번호 발송 과정이 진행되지 않았습니다.", async () => {
            sutAuthService["authRepository"].isExistsByNickname = jest.fn(async (): Promise<boolean> => false); // Pass : AUTH-004-03
            sutAuthService["authVerifyListRepository"].isExistsByNicknameExceptEmail = jest.fn(
                async (): Promise<boolean> => false,
            ); // Pass : AUTH-004-01

            sutAuthService["authVerifyListRepository"].findVerifyListByEmail = jest.fn(
                async (): Promise<IUserVerifyListPacket | null> => null,
            );

            try {
                await sutAuthService.confirmNickname(confirmNicknameDto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(NotFoundException);

                expect(err instanceof NotFoundException && err.statusCode).toBe(404);
                expect(err instanceof NotFoundException && err.message).toBe(
                    `${email} 은 인증번호 발송 과정이 진행되지 않았습니다.`,
                );
                expect(err instanceof NotFoundException && err.errorCode).toBe("AUTH-004-01");
            }
        });

        it("should throw AUTH-004-04, ${email} 은 인증번호 확인 과정이 진행되지 않았습니다.", async () => {
            sutAuthService["authRepository"].isExistsByNickname = jest.fn(async (): Promise<boolean> => false); // Pass : AUTH-004-03
            sutAuthService["authVerifyListRepository"].isExistsByNicknameExceptEmail = jest.fn(
                async (): Promise<boolean> => false,
            ); // Pass : AUTH-004-01

            const mockIUserVerifyListPacket: IUserVerifyListPacket = packetFixtureProvider.getIUserVerifyListPacket({
                isVerifiedEmail: 0,
            });
            sutAuthService["authVerifyListRepository"].findVerifyListByEmail = jest.fn(
                async (): Promise<IUserVerifyListPacket | null> => mockIUserVerifyListPacket,
            );

            try {
                await sutAuthService.confirmNickname(confirmNicknameDto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(BadRequestException);

                expect(err instanceof BadRequestException && err.statusCode).toBe(400);
                expect(err instanceof BadRequestException && err.message).toBe(
                    `${email} 은 인증번호 확인 과정이 진행되지 않았습니다.`,
                );
                expect(err instanceof BadRequestException && err.errorCode).toBe("AUTH-004-04");
            }
        });

        it("should return { nicknameVerifyToken: string }", async () => {
            sutAuthService["authRepository"].isExistsByNickname = jest.fn(async (): Promise<boolean> => false); // Pass : AUTH-004-03
            sutAuthService["authVerifyListRepository"].isExistsByNicknameExceptEmail = jest.fn(
                async (): Promise<boolean> => false,
            ); // Pass : AUTH-004-01

            const mockIUserVerifyListPacket: IUserVerifyListPacket = packetFixtureProvider.getIUserVerifyListPacket({
                isVerifiedEmail: 1,
            });
            sutAuthService["authVerifyListRepository"].findVerifyListByEmail = jest.fn(
                async (): Promise<IUserVerifyListPacket | null> => mockIUserVerifyListPacket,
            );

            sutAuthService["dayjsProvider"].getDayjsInstance = jest.fn();

            const mockNicknameVerifyToken = "sample_token";
            sutAuthService["jwtProvider"].signNicknameVerifyToken = jest.fn((): string => mockNicknameVerifyToken);
            sutAuthService["dayjsProvider"].changeToProvidedFormat = jest.fn();
            sutAuthService["authVerifyListRepository"].updateVerifyListByNickname = jest.fn();

            const result = await sutAuthService.confirmNickname(confirmNicknameDto);

            // result

            expect(result).toBeDefined();
            expect(result.nicknameVerifyToken).toBeDefined();
            expect(result.nicknameVerifyToken).toBe(mockNicknameVerifyToken);

            // calling

            expect(sutAuthService["authRepository"].isExistsByNickname).toBeCalled();
            expect(sutAuthService["authVerifyListRepository"].isExistsByNicknameExceptEmail).toBeCalled();
            expect(sutAuthService["authVerifyListRepository"].findVerifyListByEmail).toBeCalled();
            expect(sutAuthService["dayjsProvider"].getDayjsInstance).toBeCalled();
            expect(sutAuthService["jwtProvider"].signNicknameVerifyToken).toBeCalled();
            expect(sutAuthService["dayjsProvider"].changeToProvidedFormat).toBeCalled();
            expect(sutAuthService["authVerifyListRepository"].updateVerifyListByNickname).toBeCalled();
        });
    });

    /**
     * 다음 테스트 그룹은 재검토가 필요합니다.
     */
    describe("AuthService.prototype.sendPassword", () => {
        it("should throw AUTH-002, ${email} 은 존재하지 않는 이메일입니다.", async () => {
            expect(1).toBe(1);
        });
    });

    /**
     * 다음 테스트 그룹은 재검토가 필요합니다.
     */
    describe("AuthService.prototype.resetPassword", () => {
        let email: string;
        let hashedPassword: string;
        let resetPasswordToken: string;
        let resetPasswordDto: ResetPasswordDto;

        beforeEach(() => {
            email = "sample_email";
            hashedPassword = "sample_hashed_password";

            resetPasswordToken = new JwtProvider().signResetPasswordToken({
                type: "ResetPasswordToken",
                email,
                hashedPassword,
            });
            resetPasswordDto = userDtoFixtureProvider.getResetPasswordDto(resetPasswordToken);
        });

        it("should throw AUTH-001-02, ${email} 은 존재하지 않는 이메일입니다.", async () => {
            try {
                sutAuthService["authRepository"].findUserByEmail = jest.fn(
                    async (): Promise<IUserPacket | null> => null,
                );

                await sutAuthService.resetPassword(resetPasswordDto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(NotFoundException);

                expect(err instanceof NotFoundException && err.statusCode).toBe(404);
                expect(err instanceof NotFoundException && err.message).toBe(`${email} 은 존재하지 않는 이메일입니다.`);
                expect(err instanceof NotFoundException && err.errorCode).toBe("AUTH-001-02");
            }
        });

        it("should return email: string", async () => {
            const mockIUserPacket: IUserPacket = packetFixtureProvider.getIUserPacket({});

            sutAuthService["authRepository"].findUserByEmail = jest.fn(
                async (): Promise<IUserPacket | null> => mockIUserPacket,
            );
            sutAuthService["authRepository"].updateUserPassword = jest.fn();

            const result = await sutAuthService.resetPassword(resetPasswordDto);

            // result

            expect(result.accessToken).toBeDefined();
            expect(result.refreshToken).toBeDefined();
            expect(result).toBeDefined();

            // calling

            expect(sutAuthService["authRepository"].findUserByEmail).toBeCalled();
            expect(sutAuthService["authRepository"].updateUserPassword).toBeCalled();
        });
    });
    afterEach(() => jest.clearAllMocks());
});
