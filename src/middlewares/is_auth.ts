import { NextFunction, Request, Response } from "express";
import { UnAuthorizedError } from "../handlers/error-responses.handler";
import Jwt_Helpers from "../helpers/jwt.helper";
import { IRequest } from "../interfaces/IRequest";

const is_auth = async (req: IRequest, res: Response, next: NextFunction) => {
  const header = req.headers["authorization"];

  if (!header || !header.startsWith("Bearer ")) {
    return next(new UnAuthorizedError("Provide token"));
  }

  const token = header.split(" ")[1];

  if (!token) {
    return next(new UnAuthorizedError("Provide token"));
  }

  const decoded: { user_id: string } = await Jwt_Helpers.verify_access_token(
    token
  );

  if (!decoded) {
    return next(new UnAuthorizedError("Invalid token"));
  }

  req.user = {
    id: decoded.user_id,
  };

  next();
};

export default is_auth;
