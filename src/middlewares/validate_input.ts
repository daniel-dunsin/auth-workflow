import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../handlers/error-responses.handler";
import { AnySchema } from "yup";
import { logger } from "../configs/logger.config";

const validate_input =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (error: any) {
      next(new BadRequestError(error.errors));
      logger.error(error.errors);
    }
  };

export default validate_input;
