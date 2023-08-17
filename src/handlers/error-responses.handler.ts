import { CustomError } from "./error.handler";

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(404, message);

    this.name = "NotFoundError";
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(400, message);

    this.name = "BadRequestError";
  }
}

export class UnAuthorizedError extends CustomError {
  constructor(message: string) {
    super(401, message);

    this.name = "UnAuthorizedError";
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(403, message);

    this.name = "ForbiddenError";
  }
}
