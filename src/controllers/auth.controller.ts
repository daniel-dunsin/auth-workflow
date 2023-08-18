import { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth.service";
import { BadRequestError } from "../handlers/error-responses.handler";
import { IUser, IUserAuth } from "../interfaces/models/user.interface";
import { IRequest } from "../interfaces/IRequest";
import SessionService from "../services/session.service";
import UserService from "../services/user.service";

class UserController {
  private readonly services: AuthService;
  private readonly session_services: SessionService;
  private readonly user_services: UserService;

  constructor() {
    this.services = new AuthService();
    this.session_services = new SessionService();
    this.user_services = new UserService();
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

  public login = async (
    req: Request<{}, {}, Partial<IUserAuth>>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password, username } = req.body;

      if (email && username) {
        return next(
          new BadRequestError("You can not use both username and email")
        );
      }

      if (!email && !username) {
        return next(new BadRequestError("Provide email and username"));
      }

      const data = await this.services.login_user({
        email,
        username,
        password,
      });

      res.status(200).json({ message: "Log in successful", data });
    } catch (error) {
      return next(error);
    }
  };

  public logout = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;

      await this.session_services.logout_session(user_id);

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  };

  public refresh_access_token = async (
    req: Request<{}, {}, { refresh_token: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const refresh_token = req.body.refresh_token;

      const access_token = await this.services.refresh_access_token(
        refresh_token
      );

      res.status(200).send({
        message: "Access token refreshed successfully",
        data: { access_token },
      });
    } catch (error) {
      next(error);
    }
  };

  public get_profile = async (
    req: IRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user_id = req.user?.id;

      const user_auth = await this.user_services.find_auth_by_id(
        user_id as string
      );

      const user = await this.user_services.find_user_by_email(user_auth.email);

      res.status(200).json({ message: "Profile found", data: user });
    } catch (error) {
      next(error);
    }
  };
}

const user_controller = new UserController();

export default user_controller;
