import * as mockHttp from "node-mocks-http";
import { Request, Response, NextFunction } from "express";

// sut
import { AuthController } from "../../../../src/routes/controllers/auth.controller";

// fixture
import { UserDtoFixtureProvider } from "../../../_.fake.datas/fixture/user.dto.fixture.provider";

// mocking
import { AuthService } from "../../../../src/routes/services/auth.service";
import { JoiValidator } from "../../../../src/modules/validators/joi.validator";

describe("Auth Controller Test", () => {
    let authController: AuthController;
    let userDtoFixtureProvider: UserDtoFixtureProvider;
    let mockRequest: Request, mockResponse: Response, mockNextFunc: NextFunction;

    beforeAll(() => {
        authController = new AuthController();
        userDtoFixtureProvider = new UserDtoFixtureProvider();
    });
    beforeEach(() => {
        mockRequest = mockHttp.createRequest();
        mockResponse = mockHttp.createResponse();
        mockNextFunc = jest.fn();
    });

    it("Authontroller be defined", () => expect(AuthController).toBeDefined());

    it("authContro", () => {
        mockRequest.body = userDtoFixtureProvider.getSigninUserDto();
        authController.signup(mockRequest, mockResponse, mockNextFunc);
    });
});
