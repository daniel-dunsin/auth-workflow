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
    const { username, firstname, lastname, password, email, phone_number } =
      body;

    await User.create({ username, email, lastname, firstname, phone_number });
    const user = await Auth.create({ username, email, password });

    return user;
  };

  public find_auth_by_id = async (_id: string): Promise<IUserAuth> => {
    const user = await Auth.findById(_id);

    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    const { password, verified, ...rest } = user.toObject();

    return rest as IUserAuth;
  };

  public find_auth_by_email = async (email: string): Promise<IUserAuth> => {
    const user = await Auth.findOne({ email });

    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    const { password, verified, ...rest } = user.toObject();

    return rest as IUserAuth;
  };

  public find_auth_by_username = async (
    username: string
  ): Promise<IUserAuth> => {
    const user = await Auth.findOne({ username });

    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    const { password, verified, ...rest } = user.toObject();

    return rest as IUserAuth;
  };

  public find_user_by_email = async (email: string): Promise<IUser> => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    return user;
  };

  public find_user_by_id = async (_id: string): Promise<IUser> => {
    const user = await User.findById(_id);

    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    return user;
  };

  public verify_user = async (_id: string): Promise<void> => {
    const user = await Auth.findById(_id);

    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    if (user.verified) {
      throw new ForbiddenError("User is already verified");
    }

    user.verified = true;
    await user.save();
  };

  public reset_password = async (_id: string, password: string) => {
    const user = await Auth.findById(_id);

    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    user.password = password;

    await user.save();
  };
}
