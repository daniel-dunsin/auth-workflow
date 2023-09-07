import { NextFunction, Request } from "express";
import {
  IToken,
  ITokenTypes,
  IUser,
  IUserAuth,
  IUserAuthToken,
} from "../interfaces/models/user.interface";
import Auth from "../models/user.auth.model";
import User from "../models/user.model";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../handlers/error-responses.handler";
import Token from "../models/user.token.model";
import { CustomError } from "../handlers/error.handler";
import send_mail from "../configs/mailer.config";
import {
  password_reset_email,
  verify_email_html,
} from "../templates/reset_html";
import settings from "../constants/settings";
import UserService from "./user.service";
import { v4 } from "uuid";
import { logger } from "../configs/logger.config";
import SessionService from "./session.service";
import Jwt_Helpers from "../helpers/jwt.helper";

export default class AuthService {
  private readonly user_service: UserService;
  private readonly session_service: SessionService;

  constructor() {
    this.user_service = new UserService();
    this.session_service = new SessionService();
  }
  public create_token = async (user_id: string, token_type: ITokenTypes) => {
    // check if the token already exists
    const token_in_db = await Token.findOne({
      user: user_id,
      type: token_type,
    });

    if (token_in_db) {
      throw new BadRequestError("Token exitst");
    }

    const token = await Token.create({ user: user_id, type: token_type });

    return token;
  };

  public register = async (body: Partial<IUser & IUserAuth>): Promise<void> => {
    const user = await this.user_service.create_user(body);
    const token = await this.create_token(
      user?._id as string,
      IToken.verify_otp_token
    );
    await send_mail({
      to: user.email,
      subject: "Verify Account",
      html: verify_email_html(
        user.username as string,
        `${settings.frontend_url}/verify-email/${user._id.toString()}/${
          token.token
        }`
      ),
    });
  };

  public verify_email_token = async (body: Partial<IUserAuthToken>) => {
    const { user, token } = body;

    const token_in_db = await Token.findOne({ token, user });

    // if the token does not exist send them a new token
    if (!token_in_db) {
      const user_db = await this.user_service.find_auth_by_id(user as string);

      const token = await Token.create({
        user,
        type: IToken.verify_otp_token,
      });

      await send_mail({
        to: user_db.email,
        subject: "Verify Account",
        html: verify_email_html(
          user_db.username,
          `${settings.frontend_url}/verify-email/${user?.toString()}/${
            token.token
          }`
        ),
      });

      throw new BadRequestError(
        "Unable to verify account, another link has been sent again to your email"
      );
    }

    await this.user_service.verify_user(user as string);

    await Token.findByIdAndDelete(token_in_db._id);
  };

  public request_password_code = async (email: string) => {
    const user = await this.user_service.find_auth_by_email(email);

    // check if the token exists. If yes, update the token with a new one and send a new email to the user
    const token_in_db = await Token.findOne({
      user: user._id,
      type: IToken.password_reset_token,
    });

    let token;

    if (token_in_db) {
      const new_token = (await Token.findByIdAndUpdate(
        token_in_db._id,
        { token: v4() },
        { new: true, runValidators: true }
      )) as IUserAuthToken;

      token = new_token.token;
    } else {
      const new_token = await Token.create({
        user: user._id,
        type: IToken.password_reset_token,
      });

      token = new_token.token;
    }

    const link = `${settings.frontend_url}/api/auth/reset-password/${token}`;

    await send_mail({
      to: user.email,
      subject: "Reset Password",
      html: password_reset_email(user.username, link),
    });
  };

  public reset_password = async (token_param: string, password: string) => {
    const token = (await Token.findOne({
      token: token_param,
      type: IToken.password_reset_token,
    })) as IUserAuthToken;

    if (!token) {
      throw new NotFoundError("Token does not exist or has expired");
    }

    await this.user_service.reset_password(token.user as string, password);
  };

  public login_user = async (
    body: Partial<IUserAuth>
  ): Promise<{ access_token: string; refresh_token: string; user: IUser }> => {
    const { email, password, username } = body;

    const user_auth = await Auth.findOne({ $or: [{ username }, { email }] });

    if (!user_auth) {
      throw new NotFoundError("This user does not exist");
    }

    if (!user_auth.verified) {
      throw new ForbiddenError("User is not verified");
    }

    const is_password_correct = await user_auth.verifyPassword(
      password as string
    );

    if (!is_password_correct) {
      throw new BadRequestError("Email or username or password is incorrect");
    }

    const session = await this.session_service.create_session(user_auth._id);

    const access_token = await Jwt_Helpers.sign_access_token(user_auth._id);
    const refresh_token = await Jwt_Helpers.sign_refresh_token(
      session?._id as string
    );

    const user = await this.user_service.find_user_by_email(user_auth.email);

    return {
      access_token,
      refresh_token,
      user,
    };
  };

  public refresh_access_token = async (
    refresh_token: string
  ): Promise<string> => {
    const decoded: { session_id: string } =
      await Jwt_Helpers.verify_refresh_token(refresh_token);

    if (!decoded) {
      throw new BadRequestError("Refresh token does not exist");
    }

    const session = await this.session_service.update_session(
      decoded.session_id
    );

    const access_token = await Jwt_Helpers.sign_access_token(
      session?.user as string
    );

    return access_token;
  };
}
