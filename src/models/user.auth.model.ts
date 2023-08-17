import mongoose, { mongo } from "mongoose";
import { IAuthMethods, IUserAuth } from "../interfaces/models/user.interface";
import settings from "../constants/settings";
import argon from "argon2";

const AuthSchema = new mongoose.Schema<IAuthMethods>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

AuthSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const password = await argon.hash(this?.password as string);

    this.password = password;
    return;
  }
});

AuthSchema.methods.verifyPassword = async function (
  password: string
): Promise<boolean> {
  const is_valid = await argon.verify(this.password, password);

  return is_valid;
};

const Auth = mongoose.model(settings.mongo.collections.auth, AuthSchema);
export default Auth;
