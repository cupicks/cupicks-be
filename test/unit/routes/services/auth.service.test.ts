// sut
import { AuthService } from "../../../../src/routes/services/auth.service";

// arrange
import { TNODE_ENV } from "../../../../src/constants/_.loader";
import {
    BadRequestException,
    ConflictException,
    Env,
    ForBiddenException,
    IUserPacket,
    IUserVerifyListPacket,
    LogoutUserDto,
    NotFoundException,
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

// arrange as mocking
import { mockModule } from "../../../_.fake.datas/mocks/_.loader";
import { UserDtoFixtureProvider, PacketFixtureProvider } from "../../../_.fake.datas/fixture/_.exporter";

jest.mock("../../../../src/modules/providers/mysql.provider", () => {
    return {
        MysqlProvider: jest.fn().mockImplementation(() => mockModule.Providers.MockMysqlProvider),
    };
});

describe("Auth Service Test"
/**
 * AuthService 에 대한 단위 테스트의 주요 목적은 다음과 같습니다.
 *
 * 1. AuthService 가 선언되었는 지 여부
 * 2. AuthService 의 `의존성의 수` 와 `메서드의 수` 확인
 * 3. AuthService.prototype.method 의 내부 분기점 확인
 *      1. 실패할 경우, 재정의 되어 있는 CustomException 이 제대로 throw 되는 지 확인
 *      2. 성공할 경우, 올바른 반환값이 return 되는 지 확인
 *
 * @since 2022-09-27
 */, () => {
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
                imageUrl: findedUser.imageUrl,
            });

            expect(sutAuthService["authRepository"].updateUserRefreshToken).toBeCalled();
        });
    });

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

    afterEach(() => jest.clearAllMocks());
});
