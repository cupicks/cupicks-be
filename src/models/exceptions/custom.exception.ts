export type TCustomException = Error;

export class CustomException implements TCustomException {
    name: string;
    message: string;
    statusCode: number;

    constructor(message: string) {
        this.name = "CustomException";
        this.message = message;
        this.statusCode = 500;
    }
}

export class ConflictException extends CustomException {
    name: string;
    statusCode: number;
    constructor(message: string) {
        super(message);

        this.name = "ConflictException";
        this.statusCode = 409;
    }
}

export class NotFoundException extends CustomException {
    name: string;
    statusCode: number;
    constructor(message: string) {
        super(message);

        this.name = "NotFoundException";
        this.statusCode = 404;
    }
}

export class JwtAuthorizationException extends CustomException {
    name: string;
    statusCode: number;
    constructor(message: string) {
        super(message);

        this.name = "JwtAuthorizationException";
        this.statusCode = 401;
    }
}
export class ForBiddenException extends CustomException {
    name: string;
    statusCode: number;
    constructor(message: string) {
        super(message);

        this.name = "ForBiddenException";
        this.statusCode = 403;
    }
}

// 500!

export class UnkownError extends CustomException {
    name: string;
    statusCode: number;
    constructor(message: string) {
        super(message);

        this.name = "UnkownError";
        this.statusCode = 500;
    }
}

export class UnkownTypeError extends CustomException {
    name: string;
    statusCode: number;
    constructor(message: string) {
        super(message);

        this.name = "UnkownTypeError";
        this.statusCode = 500;
    }
}

export class UnOverrideDtoError extends CustomException {
    name: string;
    statusCode: number;
    constructor(message: string) {
        super(message);

        this.name = "UnOverrideDtoError";
        this.statusCode = 500;
    }
}
export class DatabaseConnectionError extends CustomException {
    name: string;
    statusCode: number;
    constructor(message: string) {
        super(message);

        this.name = "DatabaseConnectionError";
        this.statusCode = 500;
    }
}
