// sut
import { AuthController } from "../../../../src/routes/controllers/auth.controller";

// type & mocking
import { Request, Response, NextFunction } from "express";
import { mockHttp, mockRoute, mockModule } from "../../../_.fake.datas/mocks/_.loader";
import { SignupUserDto, UserDto } from "../../../../src/models/_.loader";
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

describe("Auth Controller Test", () => {
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
    it("AuthController.prototpye contain ", () => expect(Object.keys(sutAuthController).length).toBe(10));

    describe("AuthService.prototype.signup", () => {
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

    it("signin should be call res.status(201).json()", async () => {
        await sutAuthController.signin(mockRequest, mockResponse, mockNextFunc);

        expect(mockResponse.status).toBeCalled();
        expect(mockResponse.status).toBeCalledWith(201);

        expect(mockResponse.json).toBeCalled();
        expect(mockResponse.json).toBeCalledWith({
            isSuccess: true,
            message: "로그인에 성공하셨습니다.",
            accessToken: undefined,
            refreshToken: undefined,
        });
    });

    it("logout should be call res.status(201).json()", async () => {
        await sutAuthController.logout(mockRequest, mockResponse, mockNextFunc);

        expect(mockResponse.status).toBeCalled();
        expect(mockResponse.status).toBeCalledWith(201);

        expect(mockResponse.json).toBeCalled();
        expect(mockResponse.json).toBeCalledWith({
            isSuccess: true,
            message: "로그아웃에 성공하셨습니다.",
        });
    });

    it("publishToken should be call res.status(201).json()", async () => {
        await sutAuthController.publishToken(mockRequest, mockResponse, mockNextFunc);

        expect(mockResponse.status).toBeCalled();
        expect(mockResponse.status).toBeCalledWith(201);

        expect(mockResponse.json).toBeCalled();
        expect(mockResponse.json).toBeCalledWith({
            isSuccess: true,
            message: "토큰 재발행에 성공하셨습니다.",
            accessToken: undefined,
        });
    });

    it("sendEmail should be call res.status(201).json()", async () => {
        await sutAuthController.sendEmail(mockRequest, mockResponse, mockNextFunc);

        expect(mockResponse.status).toBeCalled();
        expect(mockResponse.status).toBeCalledWith(201);

        expect(mockResponse.json).toBeCalled();
        expect(mockResponse.json).toBeCalledWith({
            isSuccess: true,
            message: `사용자 이메일로 6자리 숫자가 발송되었어요!`,
            date: undefined,
            exceededDate: undefined,
        });
    });

    it("confirmEmailCode should be call res.status(201).json()", async () => {
        await sutAuthController.confirmEmailCode(mockRequest, mockResponse, mockNextFunc);

        expect(mockResponse.status).toBeCalled();
        expect(mockResponse.status).toBeCalledWith(201);

        expect(mockResponse.json).toBeCalled();
        expect(mockResponse.json).toBeCalledWith({
            isSuccess: true,
            message: "사용자 이메일 인증이 완료되었습니다.",
            emailVerifyToken: undefined,
        });
    });

    it("confirmNickname should be call res.status(201).json()", async () => {
        await sutAuthController.confirmNickname(mockRequest, mockResponse, mockNextFunc);

        expect(mockResponse.status).toBeCalled();
        expect(mockResponse.status).toBeCalledWith(201);

        expect(mockResponse.json).toBeCalled();
        expect(mockResponse.json).toBeCalledWith({
            isSuccess: true,
            message: "사용자 닉네임 중복확인이 완료되었습니다.",
            nicknameVerifyToken: undefined,
        });
    });

    it("sendPassword should be call res.status(201).json()", async () => {
        await sutAuthController.sendPassword(mockRequest, mockResponse, mockNextFunc);

        expect(mockResponse.status).toBeCalled();
        expect(mockResponse.status).toBeCalledWith(201);

        expect(mockResponse.json).toBeCalled();
        expect(mockResponse.json).toBeCalledWith({
            isSuccess: true,
            message: `임시 비밀번호를 이메일로 발송했어요!`,
            date: undefined,
            exceededDate: undefined,
        });
    });

    it("resetPassword should be call res.status(302).redirect()", async () => {
        await sutAuthController.resetPassword(mockRequest, mockResponse, mockNextFunc);

        expect(mockResponse.status).toBeCalled();
        expect(mockResponse.status).toBeCalledWith(302);

        expect(mockResponse.json).not.toBeCalled();
        expect(mockResponse.redirect).toBeCalled();
        expect(mockResponse.redirect).toBeCalledWith(`${undefined}/signIn?email=${undefined}`);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });
});
