import mongoose, { mongo } from "mongoose";
import { IUserAuth } from "../interfaces/models/user.interface";
import settings from "../constants/settings";

const AuthSchema = new mongoose.Schema<IUserAuth>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Auth = mongoose.model(settings.mongo.collections.auth, AuthSchema);
export default Auth;
