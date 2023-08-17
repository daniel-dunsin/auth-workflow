import { config } from "dotenv";
import { collections } from "./collections";

config();

const settings = {
  mongo: {
    url: process.env.MONGO_URL,
    collections: {
      auth: collections.auth,
      user: collections.user,
      token: collections.token,
    },
  },
  port: process.env.PORT,
};

export default settings;
