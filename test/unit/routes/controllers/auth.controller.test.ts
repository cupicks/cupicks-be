// sut
import { AuthController } from "../../../../src/routes/controllers/auth.controller";

// type & mocking
import { Request, Response, NextFunction } from "express";
import { mockHttp, mockRoute, mockModule } from "../../../_.fake.datas/mocks/_.loader";
import {
    ConfirmEmailDto,
    LogoutUserDto,
    PublishTokenDto,
    ResetPasswordDto,
    SendEmailDto,
    SendPasswordDto,
    SigninUserDto,
    SignupUserDto,
    UserDto,
} from "../../../../src/models/_.loader";
import { UserDtoFixtureProvider } from "../../../_.fake.datas/fixture/user.dto.fixture.provider";

jest.mock("../../../../src/routes/services/auth.service", () => {
    return {
        AuthService: jest.fn().mockImplementation(() => mockRoute.Services.MockAuthService),
    };
});
jest.mock("../../../../src/modules/factory/dto.factory", () => {
    return {
        DtoFactory: jest.fn().mockImplementation(() => mockModule.Factories.MockDtoFactory),
    };
});

describe("Auth Controller Test"
/**
 * AuthControlelr 에 대한 단위 테스트의 주요 목적은 다음과 같습니다.
 *
 * 1. AuthController 가 선언되었는 지 여부
 * 2. AuthController 의 `의존성의 수` 와 `메서드의 수` 확인
 * 3. AuthController.prototype.method 의 내부 분기점 확인
 *      1. 실패할 경우 mockResponse 의 내장 메서드의 호출 여부 및 호출 매개변수 확인
 *      2. 성공할 경우 mockResponse 의 내장 메서드의 호출 여부 및 호출 매개변수 확인
 *
 * @since 2022-09-26
 */, () => {
    let sutAuthController: AuthController;
    let userDtoFixtureProvider: UserDtoFixtureProvider;
    let mockRequest: Request, mockResponse: Response, mockNextFunc: NextFunction;

    let mockErrorCode: string, mockErrorMessage: string, mockErrorInstance: Error;

    beforeAll(() => {
        sutAuthController = new AuthController();
        userDtoFixtureProvider = new UserDtoFixtureProvider();

        mockErrorCode = "UNKOWN";
        mockErrorMessage = "Mock Error";
        mockErrorInstance = new Error(mockErrorMessage);
    });

    beforeEach(() => {
        mockRequest = mockHttp.getMockRequest();
        mockResponse = mockHttp.getMockResponse();
    });

    it("AuthController be defined", () => expect(AuthController).toBeDefined());
    it("AuthController.prototpye contain 2 dependencies and 10 methods", () => {
        expect(Object.keys(sutAuthController).length).toBe(12);

        expect(sutAuthController["authService"]).toBeDefined();
        expect(sutAuthController["dtoFactory"]).toBeDefined();

        expect(sutAuthController.signup).toBeDefined();
        expect(typeof sutAuthController.signup).toBe("function");

        expect(sutAuthController.signin).toBeDefined();
        expect(typeof sutAuthController.signin).toBe("function");

        expect(sutAuthController.logout).toBeDefined();
        expect(typeof sutAuthController.logout).toBe("function");

        expect(sutAuthController.publishToken).toBeDefined();
        expect(typeof sutAuthController.publishToken).toBe("function");

        expect(sutAuthController.sendEmail).toBeDefined();
        expect(typeof sutAuthController.sendEmail).toBe("function");

        expect(sutAuthController.confirmEmailCode).toBeDefined();
        expect(typeof sutAuthController.confirmEmailCode).toBe("function");

        expect(sutAuthController.confirmNickname).toBeDefined();
        expect(typeof sutAuthController.confirmNickname).toBe("function");

        expect(sutAuthController.sendPassword).toBeDefined();
        expect(typeof sutAuthController.sendPassword).toBe("function");

        expect(sutAuthController.resetPassword).toBeDefined();
        expect(typeof sutAuthController.resetPassword).toBe("function");

        expect(sutAuthController["errorHandler"]).toBeDefined();
        expect(typeof sutAuthController["errorHandler"]).toBe("function");
    });

    describe("AuthController.prototype.signup", () => {
        let signupUserDto: SignupUserDto;
        let userDto: UserDto;

        beforeEach(() => {
            signupUserDto = userDtoFixtureProvider.getSignupUserDto();
            userDto = userDtoFixtureProvider.getUserDto({});

            sutAuthController["dtoFactory"].getSignupUserDto = jest.fn(async (): Promise<SignupUserDto> => {
                return signupUserDto;
            });

            sutAuthController["authService"].signup = jest.fn(async (): Promise<UserDto> => {
                return userDto;
            });
        });

        it("should call res.status(201).json()", async () => {
            await sutAuthController.signup(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(201);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: true,
                message: "회원가입에 성공하셨습니다.",
                user: userDto,
            });
        });

        it("should call res.status(500).json()", async () => {
            sutAuthController["authService"].signup = jest.fn(async (): Promise<UserDto> => {
                throw mockErrorInstance;
            });

            await sutAuthController.signup(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(500);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: false,
                message: mockErrorInstance.message,
                errorCode: mockErrorCode,
            });
        });

        afterEach(() => jest.clearAllMocks());
    });

    describe("AuthController.prototype.signin", () => {
        let signinUserDto: SigninUserDto;
        let tokenDto: {
            accessToken: string;
            refreshToken: string;
        };

        beforeEach(() => {
            signinUserDto = userDtoFixtureProvider.getSigninUserDto();
            tokenDto = {
                accessToken: "sample_token",
                refreshToken: "sample_token",
            };

            sutAuthController["dtoFactory"].getSigninUserDto = jest.fn(async () => {
                return signinUserDto;
            });

            sutAuthController["authService"].signin = jest.fn(async () => {
                return tokenDto;
            });
        });

        it("should call res.status(201).json", async () => {
            await sutAuthController.signin(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(201);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: true,
                message: "로그인에 성공하셨습니다.",
                accessToken: tokenDto.accessToken,
                refreshToken: tokenDto.refreshToken,
            });
        });

        it("should call res.status(500).json()", async () => {
            sutAuthController["authService"].signin = jest.fn(async (): Promise<typeof tokenDto> => {
                throw mockErrorInstance;
            });

            await sutAuthController.signup(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(500);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: false,
                message: mockErrorInstance.message,
                errorCode: mockErrorCode,
            });
        });
    });

    describe("AuthController.prototype.logout", () => {
        let logoutUserDto: LogoutUserDto;

        beforeEach(() => {
            logoutUserDto = userDtoFixtureProvider.getLogoutUserDto();

            sutAuthController["dtoFactory"].getLogoutUserDto = jest.fn(
                async (): Promise<LogoutUserDto> => logoutUserDto,
            );
        });

        it("should call res.status(201).json()", async () => {
            await sutAuthController.logout(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(201);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: true,
                message: "로그아웃에 성공하셨습니다.",
            });
        });

        it("should call res.status(500).json()", async () => {
            sutAuthController["authService"].logout = jest.fn(async (): Promise<void> => {
                throw mockErrorInstance;
            });

            await sutAuthController.logout(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(500);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: false,
                message: mockErrorInstance.message,
                errorCode: mockErrorCode,
            });
        });
    });

    describe("AuthController.prototype.publishToken", () => {
        let publishTokenDto: PublishTokenDto;
        let accessToken: string;

        beforeEach(() => {
            publishTokenDto = userDtoFixtureProvider.getPublishTokenDto();
            accessToken = "sample_token";

            sutAuthController["dtoFactory"].getPublishTokenDto = jest.fn(async () => publishTokenDto);
            sutAuthController["authService"].publishToken = jest.fn(async () => accessToken);
        });

        it("should call res.status(201).json()", async () => {
            await sutAuthController.publishToken(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(201);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: true,
                message: "토큰 재발행에 성공하셨습니다.",
                accessToken: accessToken,
            });
        });

        it("should call res.status(500).json()", async () => {
            sutAuthController["authService"].publishToken = jest.fn(async (): Promise<string> => {
                throw mockErrorInstance;
            });

            await sutAuthController.logout(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(500);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: false,
                message: mockErrorInstance.message,
                errorCode: mockErrorCode,
            });
        });
    });

    describe("AuthController.prototype.sendEmail", () => {
        let sendEmailDto: SendEmailDto;
        let result: {
            email: string;
            date: string;
            exceededDate:
                | {
                      lastSentDate: string;
                      accessibleDate: string;
                  }
                | undefined;
        };

        beforeEach(() => {
            sendEmailDto = userDtoFixtureProvider.getSendEmailDto();
            result = {
                email: "sample_email",
                date: "sample_date",
                exceededDate: {
                    lastSentDate: "sample_last_sent_date",
                    accessibleDate: "sample_accessible_date",
                },
            };

            sutAuthController["dtoFactory"].getSendEmailDto = jest.fn(async (): Promise<SendEmailDto> => sendEmailDto);
            sutAuthController["authService"].sendEmail = jest.fn(async (): Promise<typeof result> => result);
        });

        it("should call res.status(201).json()", async () => {
            await sutAuthController.sendEmail(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(201);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: true,
                message: "사용자 이메일로 6자리 숫자가 발송되었어요!",
                date: result?.date,
                exceededDate: result?.exceededDate,
            });
        });

        it("should call res.status(500).json()", async () => {
            sutAuthController["authService"].sendEmail = jest.fn(async (): Promise<typeof result> => {
                throw mockErrorInstance;
            });

            await sutAuthController.sendEmail(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(500);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: false,
                message: mockErrorInstance.message,
                errorCode: mockErrorCode,
            });
        });
    });

    describe("AuthController.prototype.confirmEmailCode", () => {
        let confirmEmailDto: ConfirmEmailDto;
        let result: {
            emailVerifyToken: string;
        };

        beforeEach(() => {
            confirmEmailDto = userDtoFixtureProvider.getConfirmEmailDto();
            result = {
                emailVerifyToken: "sample_token",
            };

            sutAuthController["dtoFactory"].getConfirmEmailDto = jest.fn(
                async (): Promise<ConfirmEmailDto> => confirmEmailDto,
            );
            sutAuthController["authService"].confirmEmailCode = jest.fn(async (): Promise<typeof result> => result);
        });

        it("should call res.status(201).json()", async () => {
            await sutAuthController.confirmEmailCode(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(201);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: true,
                message: "사용자 이메일 인증이 완료되었습니다.",
                emailVerifyToken: result.emailVerifyToken,
            });
        });

        it("should call res.status(500).json()", async () => {
            sutAuthController["authService"].confirmEmailCode = jest.fn(async (): Promise<typeof result> => {
                throw mockErrorInstance;
            });

            await sutAuthController.confirmEmailCode(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(500);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: false,
                message: mockErrorInstance.message,
                errorCode: mockErrorCode,
            });
        });
    });
    describe("AuthController.prototype.sendPassword", () => {
        let sendPasswordDto: SendPasswordDto;
        let result: {
            date: string;
            email: string;
            exceededDate:
                | {
                      lastSentDate: string;
                      accessibleDate: string;
                  }
                | undefined;
        };

        beforeEach(() => {
            sendPasswordDto = userDtoFixtureProvider.getSendPasswordDto();
            result = {
                date: "sample_date",
                email: "sample_email",
                exceededDate: {
                    lastSentDate: "sample_last_sent_date",
                    accessibleDate: "sample_accessible_date",
                },
            };

            sutAuthController["dtoFactory"].getSendPasswordDto = jest.fn(
                async (): Promise<SendPasswordDto> => sendPasswordDto,
            );
            sutAuthController["authService"].sendPassword = jest.fn(async (): Promise<typeof result> => result);
        });

        it("should call res.status(201).json()", async () => {
            await sutAuthController.sendPassword(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(201);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: true,
                message: "임시 비밀번호를 이메일로 발송했어요!",
                date: result.date,
                exceededDate: result.exceededDate,
            });
        });

        it("should call res.status(500).json()", async () => {
            sutAuthController["authService"].sendPassword = jest.fn(async (): Promise<typeof result> => {
                throw mockErrorInstance;
            });

            await sutAuthController.sendPassword(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(500);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: false,
                message: mockErrorInstance.message,
                errorCode: mockErrorCode,
            });
        });
    });

    describe("AuthController.prototype.resetPassword", () => {
        let resetPasswordDto: ResetPasswordDto;
        let email: string;

        beforeEach(() => {
            resetPasswordDto = userDtoFixtureProvider.getResetPasswordDto();
            email = "sample_email";

            sutAuthController["dtoFactory"].getResetPasswordDto = jest.fn(
                async (): Promise<ResetPasswordDto> => resetPasswordDto,
            );
            sutAuthController["authService"].resetPassword = jest.fn(async (): Promise<string> => email);
        });

        it("should call res.status(302).json()", async () => {
            await sutAuthController.resetPassword(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(302);

            expect(mockResponse.json).not.toBeCalled();
            expect(mockResponse.redirect).toBeCalled();
            expect(mockResponse.redirect).toBeCalledWith(`${undefined}/signIn?email=${email}`);
        });
        it("should call res.status(500).json()", async () => {
            sutAuthController["authService"].resetPassword = jest.fn(async (): Promise<string> => {
                throw mockErrorInstance;
            });

            await sutAuthController.sendPassword(mockRequest, mockResponse, mockNextFunc);

            expect(mockResponse.status).toBeCalled();
            expect(mockResponse.status).toBeCalledWith(500);

            expect(mockResponse.json).toBeCalled();
            expect(mockResponse.json).toBeCalledWith({
                isSuccess: false,
                message: mockErrorInstance.message,
                errorCode: mockErrorCode,
            });
        });
    });

    afterEach(() => jest.clearAllMocks());
});
