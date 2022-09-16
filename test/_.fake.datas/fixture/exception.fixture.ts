import * as ExceptionFile from "../../../src/models/exceptions/custom.exception";

export class CustomExceptionFixtureProvider {
    public getCustomException(message = "에러입니다."): ExceptionFile.CustomException {
        return new ExceptionFile.CustomException(message);
    }
    public getValidationException(message = "에러입니다."): ExceptionFile.ValidationException {
        return new ExceptionFile.ValidationException(message);
    }
    public getBadRequestException(message = "에러입니다."): ExceptionFile.BadRequestException {
        return new ExceptionFile.BadRequestException(message);
    }
    public getJwtAuthorizationException(message = "에러입니다."): ExceptionFile.JwtAuthorizationException {
        return new ExceptionFile.JwtAuthorizationException(message);
    }
    public getForBiddenException(message = "에러입니다."): ExceptionFile.ForBiddenException {
        return new ExceptionFile.ForBiddenException(message);
    }
    public getNotFoundException(message = "에러입니다."): ExceptionFile.NotFoundException {
        return new ExceptionFile.NotFoundException(message);
    }
    public getConflictException(message = "에러입니다."): ExceptionFile.ConflictException {
        return new ExceptionFile.ConflictException(message);
    }
    public getUnkownError(message = "에러입니다."): ExceptionFile.UnkownError {
        return new ExceptionFile.UnkownError(message);
    }
    public getUnkownTypeError(message = "에러입니다."): ExceptionFile.UnkownTypeError {
        return new ExceptionFile.UnkownTypeError(message);
    }
    public getUnOverrideDtoError(message = "에러입니다."): ExceptionFile.UnOverrideDtoError {
        return new ExceptionFile.UnOverrideDtoError(message);
    }
    public getDatabaseConnectionError(message = "에러입니다."): ExceptionFile.DatabaseConnectionError {
        return new ExceptionFile.DatabaseConnectionError(message);
    }
}
