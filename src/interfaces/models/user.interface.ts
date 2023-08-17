import { Types } from "mongoose";

export enum IToken {
  password_reset_token = "password_reset_token",
  verify_otp_token = "verify_otp_token",
}

export type ITokenTypes = IToken.password_reset_token | IToken.verify_otp_token;

export interface IUser {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  phone_number: number;
}

export interface IUserAuth {
  _id: string;
  email: string;
  username: string;
  password?: string;
  confirm_password?: string;
  verified?: boolean;
}

export interface IAuthMethods extends Document, IUserAuth {
  verifyPassword(password: string): boolean;
}

export interface IUserAuthToken {
  _id: string;
  user: string | IUser | Types.ObjectId;
  type: ITokenTypes;
  token: string;
  createdAt: Date;
}
