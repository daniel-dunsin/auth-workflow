import { config } from "dotenv";
import { collections } from "./collections";

config();

const settings = {
  mongo: {
    url: <string>process.env.MONGO_URL,
    collections: {
      auth: collections.auth,
      user: collections.user,
      token: collections.token,
      session: collections.session,
    },
  },
  port: <string>process.env.PORT,
  mailer: {
    password: <string>process.env.NODEMAILER_PASS,
    user: <string>process.env.NODEMAILER_USER,
  },
  secret_keys: {
    access_token: <string>process.env.ACCESS_TOKEN_KEY,
    refresh_token: <string>process.env.REFRESH_TOKEN_KEY,
  },
  frontend_url: <string>process.env.FRONTEND_URL,
  google: {
    client_id: <string>process.env.GOOGLE_CLIENT_ID,
    secret: <string>process.env.GOOGLE_CLIENT_SECRET,
  },
};

export default settings;
