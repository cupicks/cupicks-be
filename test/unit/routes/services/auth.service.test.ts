// sut
import { AuthService } from "../../../../src/routes/services/auth.service";

// arrange
import { TNODE_ENV } from "../../../../src/constants/_.loader";
import {
    BadRequestException,
    ConflictException,
    Env,
    IUserVerifyListPacket,
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
import { UserDtoFixtureProvider } from "../../../_.fake.datas/fixture/_.exporter";

jest.mock("../../../../src/modules/providers/mysql.provider", () => {
    return {
        MysqlProvider: jest.fn().mockImplementation(() => mockModule.Providers.MockMysqlProvider),
    };
});

describe("Auth Service Test", () => {
    let sutAuthService: AuthService;
    let userDtoFixtureProvider: UserDtoFixtureProvider;
    let MODE: TNODE_ENV, ENV: Env;

    beforeAll(async () => {
        MODE = "test";
        EnvProvider.init(MODE);
        ENV = new EnvProvider().getEnvInstance();

        // await MysqlProvider.init(ENV.MYSQL);

        JwtProvider.init(ENV.JWT);
        BcryptProvider.init(ENV.SALT);
        MulterProvider.init(ENV.S3);
        AwsSesProvider.init(ENV.SES, ENV.URL.SERVER_URL_WITH_PORT);

        sutAuthService = new AuthService();
        userDtoFixtureProvider = new UserDtoFixtureProvider();
    });

    it("AuthService must be defined", () => expect(AuthService).toBeDefined());

    describe("AuthService.prototype.signup", () => {
        let signupUserDto: SignupUserDto;
        let email: string, nickname: string;
        let emailVerifyToken: string, nicknameVerifyToken: string;

        beforeEach(() => {
            email = "sample_email";
            nickname = "sample_nickname";

            sutAuthService["bcryptProvider"].hashPassword = jest.fn((password: string): string => password);
            sutAuthService["mysqlProvider"].getConnection = mockModule.Providers.getMockConnection;

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

        beforeEach(() => jest.clearAllMocks());
    });

    afterAll(() => jest.clearAllMocks());
});
