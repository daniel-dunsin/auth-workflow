import { IUser, IUserAuth } from "../interfaces/models/user.interface";
import User from "../models/user.model";
import Auth from "../models/user.auth.model";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../handlers/error-responses.handler";

export default class UserService {
  constructor() {}

  public create_user = async (
    body: Partial<IUser & IUserAuth>
  ): Promise<IUserAuth> => {
    try {
      const { username, firstname, lastname, password, email, phone_number } =
        body;

      await User.create({ username, email, lastname, firstname, phone_number });
      const user = await Auth.create({ username, email, password });

      return user;
    } catch (error: any) {
      console.log(error);
      if (error.code === 11000) {
        throw new BadRequestError(
          "A user with this email, username or phone number exists"
        );
      }
      throw new BadRequestError(error.message);
    }
  };

  public find_auth_by_id = async (_id: string): Promise<IUserAuth> => {
    try {
      const user = await Auth.findById(_id);

      if (!user) {
        throw new NotFoundError("User does not exist");
      }

      const { password, verified, ...rest } = user.toObject();

      return rest as IUserAuth;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  };

  public find_auth_by_email = async (email: string): Promise<IUserAuth> => {
    try {
      const user = await Auth.findOne({ email });

      if (!user) {
        throw new NotFoundError("User does not exist");
      }

      const { password, verified, ...rest } = user.toObject();

      return rest as IUserAuth;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  };

  public find_auth_by_username = async (
    username: string
  ): Promise<IUserAuth> => {
    try {
      const user = await Auth.findOne({ username });

      if (!user) {
        throw new NotFoundError("User does not exist");
      }

      const { password, verified, ...rest } = user.toObject();

      return rest as IUserAuth;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  };

  public find_user_by_email = async (email: string): Promise<IUser> => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw new NotFoundError("User does not exist");
      }

      return user;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  };

  public find_user_by_id = async (_id: string): Promise<IUser> => {
    try {
      const user = await User.findById(_id);

      if (!user) {
        throw new NotFoundError("User does not exist");
      }

      return user;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  };

  public verify_user = async (_id: string): Promise<void> => {
    try {
      const user = await Auth.findById(_id);

      if (!user) {
        throw new NotFoundError("User does not exist");
      }

      if (user.verified) {
        throw new ForbiddenError("User is already verified");
      }

      user.verified = true;
      await user.save();
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  };

  public reset_password = async (_id: string, password: string) => {
    try {
      const user = await Auth.findById(_id);

      if (!user) {
        throw new NotFoundError("User does not exist");
      }

      user.password = password;

      await user.save();
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  };
}
