// sut
import { JoiValidator } from "../../../../src/modules/validators/joi.validator";

// mocks
import { CustomException, IBaseDto, SignupUserDto } from "../../../../src/models/_.loader";
import { UserDtoFixtureProvider } from "../../../_.fake.datas/fixture/_.exporter";

describe("Joi Validator Test", () => {
    let sutJoiValidator: JoiValidator;
    let userDtoFixtureProvider: UserDtoFixtureProvider;

    beforeAll(() => {
        sutJoiValidator = new JoiValidator();
        userDtoFixtureProvider = new UserDtoFixtureProvider();
    });

    it("JoiValidator must be defined", () => expect(JoiValidator).toBeDefined());

    it("JoiValidator must have 1 private method and 1 public method", () => {
        expect(sutJoiValidator["errorHandler"]).toBeDefined();
        expect(typeof sutJoiValidator["errorHandler"]).toBe("function");

        expect(sutJoiValidator.validateAsync).toBeDefined();
        expect(typeof sutJoiValidator.validateAsync).toBe("function");
    });

    describe("sutJoiValidator.prototype.errorHandler", () => {
        it("should return CustomException with 1", () => {
            const unkown = 1;
            const result = sutJoiValidator["errorHandler"](unkown);

            expect(result.statusCode).toBe(500);
            expect(result.name).toBe("UnkownTypeError");
            expect(result.message).toBe(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(unkown)}`);

            expect(result.errorCode).toBe("UNKOWN");
            expect(result.errorResult).toEqual({});
        });

        it('should return CustomException with "string" ', () => {
            const unkown = "string";
            const result = sutJoiValidator["errorHandler"](unkown);

            expect(result.statusCode).toBe(500);
            expect(result.name).toBe("UnkownTypeError");
            expect(result.message).toBe(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(unkown)}`);

            expect(result.errorCode).toBe("UNKOWN");
            expect(result.errorResult).toEqual({});
        });

        it("should return CustomException with [1,2,3]", () => {
            const unkown = [1, 2, 3];
            const result = sutJoiValidator["errorHandler"](unkown);

            expect(result.statusCode).toBe(500);
            expect(result.name).toBe("UnkownTypeError");
            expect(result.message).toBe(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(unkown)}`);

            expect(result.errorCode).toBe("UNKOWN");
            expect(result.errorResult).toEqual({});
        });

        it('should return CustomException with {name: "hello"} ', () => {
            const unkown = {
                name: "hello",
            };
            const result = sutJoiValidator["errorHandler"](unkown);

            expect(result.statusCode).toBe(500);
            expect(result.name).toBe("UnkownTypeError");
            expect(result.message).toBe(`알 수 없는 에러가 발생하였습니다. 대상 : ${JSON.stringify(unkown)}`);

            expect(result.errorCode).toBe("UNKOWN");
            expect(result.errorResult).toEqual({});
        });

        it("should return CustomException with Error", () => {
            const unkown = new Error("hello");
            const result = sutJoiValidator["errorHandler"](unkown);

            expect(result.statusCode).toBe(400);
            expect(result.name).toBe("ValidationException");
            expect(result.message).toBe(unkown.message);

            expect(result.errorCode).toBe("REQUEST_VALIDATION_FAIL");
            expect(result.errorResult).toEqual({});
        });

        it("should return CustomException with CustomException", () => {
            const unkown = new CustomException("hello");
            const result = sutJoiValidator["errorHandler"](unkown);

            expect(result.statusCode).toBe(500);
            expect(result.name).toBe("CustomException");
            expect(result.message).toBe(unkown.message);

            expect(result.errorCode).toBe("UNKOWN");
            expect(result.errorResult).toEqual({});
        });
    });

    describe("sutJoiValidator.prototype.validateAsync<T extends IBaseDto>", () => {
        let signupUserDto: SignupUserDto;

        beforeEach(() => {
            signupUserDto = userDtoFixtureProvider.getSignupUserDto();
        });

        it("should return T", async () => {
            const result = await sutJoiValidator.validateAsync<SignupUserDto>(signupUserDto);

            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(SignupUserDto);
        });
        it("shoudl throw CustomException", async () => {
            try {
                signupUserDto.password = "a";

                await sutJoiValidator.validateAsync<SignupUserDto>(signupUserDto);
            } catch (err) {
                expect(err).toBeDefined();
                expect(err).toBeInstanceOf(CustomException);
            }
        });
    });
});
