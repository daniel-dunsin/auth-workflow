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
  mailer: {
    password: process.env.NODEMAILER_PASS,
    user: process.env.NODEMAILER_USER,
  },
  frontend_url: process.env.FRONTEND_URL,
};

export default settings;
