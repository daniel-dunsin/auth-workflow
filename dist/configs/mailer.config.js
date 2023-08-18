"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const settings_1 = __importDefault(require("../constants/settings"));
const error_responses_handler_1 = require("../handlers/error-responses.handler");
const logger_config_1 = require("./logger.config");
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: { user: settings_1.default.mailer.user, pass: settings_1.default.mailer.password },
});
const send_mail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transporter.sendMail({
            from: settings_1.default.mailer.user,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
    }
    catch (error) {
        logger_config_1.logger.error(error);
        throw new error_responses_handler_1.BadRequestError("Unable to send message");
    }
});
exports.default = send_mail;
