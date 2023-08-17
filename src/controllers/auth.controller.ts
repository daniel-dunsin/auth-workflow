import { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth.service";
import { BadRequestError } from "../handlers/error-responses.handler";
import { IUser, IUserAuth } from "../interfaces/models/user.interface";

class UserController {
  private readonly services: AuthService;

  constructor() {
    this.services = new AuthService();
  }

  public register = async (
    req: Request<{}, {}, Partial<IUser & IUserAuth>>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        firstname,
        lastname,
        phone_number,
        email,
        password,
        username,
        confirm_password,
      } = req.body;

      if (password !== confirm_password) {
        throw new BadRequestError("Passwords do not match");
      }

      await this.services.register({
        firstname,
        lastname,
        phone_number,
        email,
        password,
        username,
      });

      res.status(201).json({ message: "Verification email sent" });
    } catch (error: any) {
      next(error);
    }
  };
  public verify_email_otp = async (
    req: Request<{ id: string; token: string }, {}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.params.id;
      const token = req.params.token;

      await this.services.verify_email_token({ user, token });

      res.status(200).json({ message: "Account verified" });
    } catch (error: any) {
      next(error);
    }
  };

  public request_reset_password_code = async (
    req: Request<{}, {}, { email: string }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const email = req.body.email;

      await this.services.request_password_code(email);

      res
        .status(200)
        .json({ message: "Password reset code sent successfully" });
    } catch (error) {
      return next(error);
    }
  };

  public reset_password = async (
    req: Request<{ token: string }, {}, Partial<IUserAuth>, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.params.token;

      const { password, confirm_password } = req.body;

      if (password !== confirm_password) {
        return next(new BadRequestError("Passwords do not match"));
      }

      await this.services.reset_password(token, password as string);

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      return next(error);
    }
  };
}

const user_controller = new UserController();

export default user_controller;
