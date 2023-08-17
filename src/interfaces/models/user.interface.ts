import { Types } from "mongoose";

export enum IToken {
  password_reset_token = "password_reset_token",
  verify_otp_token = "verify_otp_token",
}

type ITokenTypes = IToken.password_reset_token | IToken.verify_otp_token;

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  phone_number: number;
}

export interface IUserAuth {
  email: string;
  username: string;
  password: string;
  verified: boolean;
}

export interface IUserAuthToken {
  user: string | IUser | Types.ObjectId;
  type: ITokenTypes;
  token: string;
  createdAt: Date;
}
