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
const user_interface_1 = require("../interfaces/models/user.interface");
const user_auth_model_1 = __importDefault(require("../models/user.auth.model"));
const error_responses_handler_1 = require("../handlers/error-responses.handler");
const user_token_model_1 = __importDefault(require("../models/user.token.model"));
const error_handler_1 = require("../handlers/error.handler");
const mailer_config_1 = __importDefault(require("../configs/mailer.config"));
const reset_html_1 = require("../templates/reset_html");
const settings_1 = __importDefault(require("../constants/settings"));
const user_service_1 = __importDefault(require("./user.service"));
const uuid_1 = require("uuid");
const logger_config_1 = require("../configs/logger.config");
const session_service_1 = __importDefault(require("./session.service"));
const jwt_helper_1 = __importDefault(require("../helpers/jwt.helper"));
class AuthService {
    constructor() {
        this.create_token = (user_id, token_type) => __awaiter(this, void 0, void 0, function* () {
            try {
                // check if the token already exists
                const token_in_db = yield user_token_model_1.default.findOne({
                    user: user_id,
                    type: token_type,
                });
                if (token_in_db) {
                    throw new error_responses_handler_1.BadRequestError("Token exitst");
                }
                const token = yield user_token_model_1.default.create({ user: user_id, type: token_type });
                return token;
            }
            catch (error) {
                throw new error_handler_1.CustomError(500, "Unable to create token");
            }
        });
        this.register = (body) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user_service.create_user(body);
                const token = yield this.create_token(user === null || user === void 0 ? void 0 : user._id, user_interface_1.IToken.verify_otp_token);
                yield (0, mailer_config_1.default)({
                    to: user.email,
                    subject: "Verify Account",
                    html: (0, reset_html_1.verify_email_html)(user.username, `${settings_1.default.frontend_url}/api/auth/verify-user/${user._id.toString()}/${token.token}`),
                });
                logger_config_1.logger.info("Created Account");
            }
            catch (error) {
                throw new error_responses_handler_1.BadRequestError(error);
            }
        });
        this.verify_email_token = (body) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, token } = body;
                const token_in_db = yield user_token_model_1.default.findOne({ token, user });
                // if the token does not exist send them a new token
                if (!token_in_db) {
                    const user_db = yield this.user_service.find_auth_by_id(user);
                    const token = yield user_token_model_1.default.create({
                        user,
                        type: user_interface_1.IToken.verify_otp_token,
                    });
                    yield (0, mailer_config_1.default)({
                        to: user_db.email,
                        subject: "Verify Account",
                        html: (0, reset_html_1.verify_email_html)(user_db.username, `${settings_1.default.frontend_url}/api/auth/verify-user/${user}/${token}`),
                    });
                    throw new error_responses_handler_1.BadRequestError("Unable to verify account, another link has been sent again to your email");
                }
                yield this.user_service.verify_user(user);
                yield user_token_model_1.default.findByIdAndDelete(token_in_db._id);
            }
            catch (error) {
                throw new error_responses_handler_1.BadRequestError(error.message);
            }
        });
        this.request_password_code = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user_service.find_auth_by_email(email);
                // check if the token exists. If yes, update the token with a new one and send a new email to the user
                const token_in_db = yield user_token_model_1.default.findOne({
                    user: user._id,
                    type: user_interface_1.IToken.password_reset_token,
                });
                let token;
                if (token_in_db) {
                    const new_token = (yield user_token_model_1.default.findByIdAndUpdate(token_in_db._id, { token: (0, uuid_1.v4)() }, { new: true, runValidators: true }));
                    token = new_token.token;
                }
                else {
                    const new_token = yield user_token_model_1.default.create({
                        user: user._id,
                        type: user_interface_1.IToken.password_reset_token,
                    });
                    token = new_token.token;
                }
                const link = `${settings_1.default.frontend_url}/api/auth/reset-password/${token}`;
                yield (0, mailer_config_1.default)({
                    to: user.email,
                    subject: "Reset Password",
                    html: (0, reset_html_1.password_reset_email)(user.username, link),
                });
            }
            catch (error) {
                throw new error_responses_handler_1.BadRequestError(error);
            }
        });
        this.reset_password = (token_param, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (yield user_token_model_1.default.findOne({
                    token: token_param,
                    type: user_interface_1.IToken.password_reset_token,
                }));
                if (!token) {
                    throw new error_responses_handler_1.NotFoundError("Token does not exist or has expired");
                }
                yield this.user_service.reset_password(token.user, password);
            }
            catch (error) {
                throw new error_responses_handler_1.BadRequestError(error);
            }
        });
        this.login_user = (body) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, username } = body;
                const user_auth = yield user_auth_model_1.default.findOne({ $or: [{ username }, { email }] });
                if (!user_auth) {
                    throw new error_responses_handler_1.NotFoundError("This user does not exist");
                }
                if (!user_auth.verified) {
                    throw new error_responses_handler_1.ForbiddenError("User is not verified");
                }
                const is_password_correct = yield user_auth.verifyPassword(password);
                if (!is_password_correct) {
                    throw new error_responses_handler_1.BadRequestError("Email or username or password is incorrect");
                }
                const session = yield this.session_service.create_session(user_auth._id);
                const access_token = yield jwt_helper_1.default.sign_access_token(user_auth._id);
                const refresh_token = yield jwt_helper_1.default.sign_refresh_token(session === null || session === void 0 ? void 0 : session._id);
                const user = yield this.user_service.find_user_by_email(user_auth.email);
                return {
                    access_token,
                    refresh_token,
                    user,
                };
            }
            catch (error) {
                logger_config_1.logger.error("Unale to log in user");
                throw new error_responses_handler_1.BadRequestError(error);
            }
        });
        this.refresh_access_token = (refresh_token) => __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = yield jwt_helper_1.default.verify_refresh_token(refresh_token);
                if (!decoded) {
                    throw new error_responses_handler_1.BadRequestError("Refresh token does not exist");
                }
                const session = yield this.session_service.update_session(decoded.session_id);
                const access_token = yield jwt_helper_1.default.sign_access_token(session === null || session === void 0 ? void 0 : session.user);
                return access_token;
            }
            catch (error) {
                throw new error_responses_handler_1.BadRequestError(error);
            }
        });
        this.user_service = new user_service_1.default();
        this.session_service = new session_service_1.default();
    }
}
exports.default = AuthService;
