import mongoose, { Types } from "mongoose";
import { IToken, IUserAuthToken } from "../interfaces/models/user.interface";
import settings from "../constants/settings";
import { v4 } from "uuid";

const TEN_MINUTES = 1000 * 60 * 10;

const TokenSchema = new mongoose.Schema<IUserAuthToken>({
  user: {
    type: Types.ObjectId,
    required: true,
    ref: settings.mongo.collections.auth,
  },
  token: {
    type: String,
    required: true,
    default: v4(),
  },
  type: {
    type: String,
    enum: [IToken.password_reset_token, IToken.verify_otp_token],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: TEN_MINUTES,
  },
});

const Token = mongoose.model(settings.mongo.collections.token, TokenSchema);
export default Token;
