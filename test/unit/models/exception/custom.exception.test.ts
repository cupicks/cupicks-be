import * as ExceptionFile from "../../../../src/models/exceptions/custom.exception";
import { CustomExceptionFixtureProvider } from "../../../_.fake.datas/fixture/exception.fixture";

/**
 * CustomException 은 Error 의 구현체입니다.
 */
describe("ExceptionFile contains all CustomException", () => {
    /** ExceptionFile 은 11 개의 클래스를 가지고 있습니다. */
    it("ExceptionFile contains 11 Classes", () => expect(Object.keys(ExceptionFile).length).toBe(11));

    describe("All Exception is implmentation of Error", () => {
        let fixtureMessage: string;
        let fixtureProvider: CustomExceptionFixtureProvider;
        beforeAll(() => {
            fixtureMessage = "샘플 에러 메세지";
            fixtureProvider = new CustomExceptionFixtureProvider();
        });

        it("CustomException is super class", () => {
            const sutException = fixtureProvider.getCustomException(fixtureMessage);
            expect(Object.keys(sutException).length).toBe(4);

            expect(sutException).not.toBeInstanceOf(Error);
            expect(sutException).toBeInstanceOf(ExceptionFile.CustomException);

            expect(sutException.name).toBe("CustomException");
            expect(sutException.message).toBe(fixtureMessage);
            expect(sutException.statusCode).toBe(500);
            expect(sutException.errorCode).toBe("UNKOWN");
            expect(sutException.errorResult).toEqual({});
        });

        describe("**Exception List", () => {
            describe("4XX Exception List", () => {
                it("ValidationException is using for '400' status code", () => {
                    const sutException = fixtureProvider.getValidationException(fixtureMessage);
                    expect(Object.keys(sutException).length).toBe(4);

                    expect(sutException).not.toBeInstanceOf(Error);
                    expect(sutException).toBeInstanceOf(ExceptionFile.CustomException);

                    expect(sutException.name).toBe("ValidationException");
                    expect(sutException.message).toBe(fixtureMessage);
                    expect(sutException.statusCode).toBe(400);

                    expect(sutException.errorCode).toBe("UNKOWN");
                    expect(sutException.errorResult).toEqual({});
                    expect(sutException).toBeInstanceOf(ExceptionFile.ValidationException);
                });
                it("BadRequestException is using for '400' status code", () => {
                    const sutException = fixtureProvider.getBadRequestException(fixtureMessage);
                    expect(Object.keys(sutException).length).toBe(4);

                    expect(sutException).not.toBeInstanceOf(Error);
                    expect(sutException).toBeInstanceOf(ExceptionFile.CustomException);

                    expect(sutException.name).toBe("BadRequestException");
                    expect(sutException.message).toBe(fixtureMessage);
                    expect(sutException.statusCode).toBe(400);

                    expect(sutException.errorCode).toBe("UNKOWN");
                    expect(sutException.errorResult).toEqual({});
                    expect(sutException).toBeInstanceOf(ExceptionFile.BadRequestException);
                });
                it("JwtAuthorizationException is using for '401' status code", () => {
                    const sutException = fixtureProvider.getJwtAuthorizationException(fixtureMessage);
                    expect(Object.keys(sutException).length).toBe(4);

                    expect(sutException).not.toBeInstanceOf(Error);
                    expect(sutException).toBeInstanceOf(ExceptionFile.CustomException);

                    expect(sutException.name).toBe("JwtAuthorizationException");
                    expect(sutException.message).toBe(fixtureMessage);
                    expect(sutException.statusCode).toBe(401);

                    expect(sutException.errorCode).toBe("UNKOWN");
                    expect(sutException.errorResult).toEqual({});
                    expect(sutException).toBeInstanceOf(ExceptionFile.JwtAuthorizationException);
                });
                it("ForBiddenException is using for '403' status code", () => {
                    const sutException = fixtureProvider.getForBiddenException(fixtureMessage);
                    expect(Object.keys(sutException).length).toBe(4);

                    expect(sutException).not.toBeInstanceOf(Error);
                    expect(sutException).toBeInstanceOf(ExceptionFile.CustomException);

                    expect(sutException.name).toBe("ForBiddenException");
                    expect(sutException.message).toBe(fixtureMessage);
                    expect(sutException.statusCode).toBe(403);

                    expect(sutException.errorCode).toBe("UNKOWN");
                    expect(sutException.errorResult).toEqual({});
                    expect(sutException).toBeInstanceOf(ExceptionFile.ForBiddenException);
                });
                it("NotFoundException is using for '404' status code", () => {
                    const sutException = fixtureProvider.getNotFoundException(fixtureMessage);
                    expect(Object.keys(sutException).length).toBe(4);

                    expect(sutException).not.toBeInstanceOf(Error);
                    expect(sutException).toBeInstanceOf(ExceptionFile.CustomException);

                    expect(sutException.name).toBe("NotFoundException");
                    expect(sutException.message).toBe(fixtureMessage);
                    expect(sutException.statusCode).toBe(404);

                    expect(sutException.errorCode).toBe("UNKOWN");
                    expect(sutException.errorResult).toEqual({});
                    expect(sutException).toBeInstanceOf(ExceptionFile.NotFoundException);
                });
                it("ConflictException is using for '409' status code", () => {
                    const sutException = fixtureProvider.getConflictException(fixtureMessage);
                    expect(Object.keys(sutException).length).toBe(4);

                    expect(sutException).not.toBeInstanceOf(Error);
                    expect(sutException).toBeInstanceOf(ExceptionFile.CustomException);

                    expect(sutException.name).toBe("ConflictException");
                    expect(sutException.message).toBe(fixtureMessage);
                    expect(sutException.statusCode).toBe(409);

                    expect(sutException.errorCode).toBe("UNKOWN");
                    expect(sutException.errorResult).toEqual({});
                    expect(sutException).toBeInstanceOf(ExceptionFile.ConflictException);
                });
            });

            describe("5XX Exception List", () => {
                it("UnkownError is using for '500' status code", () => {
                    const sutException = fixtureProvider.getUnkownError(fixtureMessage);
                    expect(Object.keys(sutException).length).toBe(4);

                    expect(sutException).not.toBeInstanceOf(Error);
                    expect(sutException).toBeInstanceOf(ExceptionFile.CustomException);

                    expect(sutException.name).toBe("UnkownError");
                    expect(sutException.message).toBe(fixtureMessage);
                    expect(sutException.statusCode).toBe(500);

                    expect(sutException.errorCode).toBe("UNKOWN");
                    expect(sutException.errorResult).toEqual({});
                    expect(sutException).toBeInstanceOf(ExceptionFile.UnkownError);
                });
                it("UnkownTypeError is using for '500' status code", () => {
                    const sutException = fixtureProvider.getUnkownTypeError(fixtureMessage);
                    expect(Object.keys(sutException).length).toBe(4);

                    expect(sutException).not.toBeInstanceOf(Error);
                    expect(sutException).toBeInstanceOf(ExceptionFile.CustomException);

                    expect(sutException.name).toBe("UnkownTypeError");
                    expect(sutException.message).toBe(fixtureMessage);
                    expect(sutException.statusCode).toBe(500);

                    expect(sutException.errorCode).toBe("UNKOWN");
                    expect(sutException.errorResult).toEqual({});
                    expect(sutException).toBeInstanceOf(ExceptionFile.UnkownTypeError);
                });
                it("UnOverrideDtoError is using for '500' status code", () => {
                    const sutException = fixtureProvider.getUnOverrideDtoError(fixtureMessage);
                    expect(Object.keys(sutException).length).toBe(4);

                    expect(sutException).not.toBeInstanceOf(Error);
                    expect(sutException).toBeInstanceOf(ExceptionFile.CustomException);

                    expect(sutException.name).toBe("UnOverrideDtoError");
                    expect(sutException.message).toBe(fixtureMessage);
                    expect(sutException.statusCode).toBe(500);

                    expect(sutException.errorCode).toBe("UNKOWN");
                    expect(sutException.errorResult).toEqual({});
                    expect(sutException).toBeInstanceOf(ExceptionFile.UnOverrideDtoError);
                });
                it("DatabaseConnectionError is using for '500' status code", () => {
                    const sutException = fixtureProvider.getDatabaseConnectionError(fixtureMessage);
                    expect(Object.keys(sutException).length).toBe(4);

                    expect(sutException).not.toBeInstanceOf(Error);
                    expect(sutException).toBeInstanceOf(ExceptionFile.CustomException);

                    expect(sutException.name).toBe("DatabaseConnectionError");
                    expect(sutException.message).toBe(fixtureMessage);
                    expect(sutException.statusCode).toBe(500);

                    expect(sutException.errorCode).toBe("UNKOWN");
                    expect(sutException.errorResult).toEqual({});
                    expect(sutException).toBeInstanceOf(ExceptionFile.DatabaseConnectionError);
                });
            });
        });
    });
});
