import mongoose, { Types } from "mongoose";
import { ISession } from "../interfaces/models/user.interface";
import settings from "../constants/settings";

const SessionSchema = new mongoose.Schema<ISession>(
  {
    user: {
      type: Types.ObjectId,
      required: true,
      ref: settings.mongo.collections.auth,
    },
    live: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Session = mongoose.model(
  settings.mongo.collections.session,
  SessionSchema
);

export default Session;
