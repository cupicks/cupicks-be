import { TERROR_CODE } from "../../constants/_.loader";

export type TCustomException = Error;
export class CustomException implements TCustomException {
    name: string;
    message: string;
    statusCode: number;
    errorCode: TERROR_CODE;

    constructor(message: string, errorCode?: TERROR_CODE) {
        this.name = "CustomException";
        this.message = message;
        this.statusCode = 500;
        this.errorCode = errorCode ?? "UNKOWN";
    }
}

export class ValidationException extends CustomException {
    name: string;
    statusCode: number;

    constructor(message: string, errorCode?: TERROR_CODE) {
        super(message, errorCode);

        this.name = "ValidationException";
        this.statusCode = 400;
    }
}

export class BadRequestException extends CustomException {
    name: string;
    statusCode: number;

    constructor(message: string, errorCode?: TERROR_CODE) {
        super(message, errorCode);

        this.name = "BadRequestException";
        this.statusCode = 400;
    }
}

export class JwtAuthorizationException extends CustomException {
    name: string;
    statusCode: number;
    constructor(message: string, errorCode?: TERROR_CODE) {
        super(message, errorCode);

        this.name = "JwtAuthorizationException";
        this.statusCode = 401;
    }
}

export class ForBiddenException extends CustomException {
    name: string;
    statusCode: number;
    constructor(message: string, errorCode?: TERROR_CODE) {
        super(message, errorCode);

        this.name = "ForBiddenException";
        this.statusCode = 403;
    }
}

export class NotFoundException extends CustomException {
    name: string;
    statusCode: number;
    constructor(message: string, errorCode?: TERROR_CODE) {
        super(message, errorCode);

        this.name = "NotFoundException";
        this.statusCode = 404;
    }
}
export class ConflictException extends CustomException {
    name: string;
    statusCode: number;
    constructor(message: string, errorCode?: TERROR_CODE) {
        super(message, errorCode);

        this.name = "ConflictException";
        this.statusCode = 409;
    }
}

// 500!

export class UnkownError extends CustomException {
    name: string;
    statusCode: number;
    constructor(message: string, errorCode?: TERROR_CODE) {
        super(message, errorCode);

        this.name = "UnkownError";
        this.statusCode = 500;
    }
}

export class UnkownTypeError extends CustomException {
    name: string;
    statusCode: number;
    constructor(message: string, errorCode?: TERROR_CODE) {
        super(message, errorCode);

        this.name = "UnkownTypeError";
        this.statusCode = 500;
    }
}

export class UnOverrideDtoError extends CustomException {
    name: string;
    statusCode: number;
    constructor(message: string, errorCode?: TERROR_CODE) {
        super(message, errorCode);

        this.name = "UnOverrideDtoError";
        this.statusCode = 500;
    }
}
export class DatabaseConnectionError extends CustomException {
    name: string;
    statusCode: number;
    constructor(message: string, errorCode?: TERROR_CODE) {
        super(message, errorCode);

        this.name = "DatabaseConnectionError";
        this.statusCode = 500;
    }
}
