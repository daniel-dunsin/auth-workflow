import mongoose from "mongoose";
import { IUser } from "../interfaces/models/user.interface";
import settings from "../constants/settings";

const UserSchema = new mongoose.Schema<IUser>(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    phone_number: { type: Number, required: true, unique: true },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

const User = mongoose.model(settings.mongo.collections.user, UserSchema);

export default User;
