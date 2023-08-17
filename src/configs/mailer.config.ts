import nodemailer, { SendMailOptions } from "nodemailer";
import settings from "../constants/settings";
import { BadRequestError } from "../handlers/error-responses.handler";
import { logger } from "./logger.config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: settings.mailer.user, pass: settings.mailer.password },
});

const send_mail = async (options: SendMailOptions) => {
  try {
    await transporter.sendMail({
      from: settings.mailer.user,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  } catch (error) {
    logger.error(error);
    throw new BadRequestError("Unable to send message");
  }
};

export default send_mail;
