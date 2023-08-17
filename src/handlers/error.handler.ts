import { error } from "console";
import { NextFunction, Request, Response } from "express";

export class CustomError extends Error {
  code: number;
  message: string;

  constructor(code: number, message: string) {
    super(message);

    this.code = code;
    this.message = message;
  }
}

export const error_handler = async (
  error: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof CustomError) {
    return res.status(error.code).send({ error: error.message });
  }

  res.status(500).send({ error });
};

export const not_found = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).send({ error: "Route does not exist" });
};
