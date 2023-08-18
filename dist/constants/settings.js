"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const collections_1 = require("./collections");
(0, dotenv_1.config)();
const settings = {
    mongo: {
        url: process.env.MONGO_URL,
        collections: {
            auth: collections_1.collections.auth,
            user: collections_1.collections.user,
            token: collections_1.collections.token,
            session: collections_1.collections.session,
        },
    },
    port: process.env.PORT,
    mailer: {
        password: process.env.NODEMAILER_PASS,
        user: process.env.NODEMAILER_USER,
    },
    secret_keys: {
        access_token: process.env.ACCESS_TOKEN_KEY,
        refresh_token: process.env.REFRESH_TOKEN_KEY,
    },
    frontend_url: process.env.FRONTEND_URL,
};
exports.default = settings;
