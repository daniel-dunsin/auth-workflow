"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.UnAuthorizedError = exports.BadRequestError = exports.NotFoundError = void 0;
const error_handler_1 = require("./error.handler");
class NotFoundError extends error_handler_1.CustomError {
    constructor(message) {
        super(404, message);
        this.name = "NotFoundError";
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends error_handler_1.CustomError {
    constructor(message) {
        super(400, message);
        this.name = "BadRequestError";
    }
}
exports.BadRequestError = BadRequestError;
class UnAuthorizedError extends error_handler_1.CustomError {
    constructor(message) {
        super(401, message);
        this.name = "UnAuthorizedError";
    }
}
exports.UnAuthorizedError = UnAuthorizedError;
class ForbiddenError extends error_handler_1.CustomError {
    constructor(message) {
        super(403, message);
        this.name = "ForbiddenError";
    }
}
exports.ForbiddenError = ForbiddenError;
