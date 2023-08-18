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
const auth_service_1 = __importDefault(require("../services/auth.service"));
const error_responses_handler_1 = require("../handlers/error-responses.handler");
const session_service_1 = __importDefault(require("../services/session.service"));
const user_service_1 = __importDefault(require("../services/user.service"));
class UserController {
    constructor() {
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstname, lastname, phone_number, email, password, username, confirm_password, } = req.body;
                if (password !== confirm_password) {
                    throw new error_responses_handler_1.BadRequestError("Passwords do not match");
                }
                yield this.services.register({
                    firstname,
                    lastname,
                    phone_number,
                    email,
                    password,
                    username,
                });
                res.status(201).json({ message: "Verification email sent" });
            }
            catch (error) {
                next(error);
            }
        });
        this.verify_email_otp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.params.id;
                const token = req.params.token;
                yield this.services.verify_email_token({ user, token });
                res.status(200).json({ message: "Account verified" });
            }
            catch (error) {
                next(error);
            }
        });
        this.request_reset_password_code = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                yield this.services.request_password_code(email);
                res
                    .status(200)
                    .json({ message: "Password reset code sent successfully" });
            }
            catch (error) {
                return next(error);
            }
        });
        this.reset_password = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.params.token;
                const { password, confirm_password } = req.body;
                if (password !== confirm_password) {
                    return next(new error_responses_handler_1.BadRequestError("Passwords do not match"));
                }
                yield this.services.reset_password(token, password);
                res.status(200).json({ message: "Password reset successful" });
            }
            catch (error) {
                return next(error);
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, username } = req.body;
                if (email && username) {
                    return next(new error_responses_handler_1.BadRequestError("You can not use both username and email"));
                }
                if (!email && !username) {
                    return next(new error_responses_handler_1.BadRequestError("Provide email and username"));
                }
                const data = yield this.services.login_user({
                    email,
                    username,
                    password,
                });
                res.status(200).json({ message: "Log in successful", data });
            }
            catch (error) {
                return next(error);
            }
        });
        this.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                yield this.session_services.logout_session(user_id);
                res.status(200).json({ message: "Logged out successfully" });
            }
            catch (error) {
                next(error);
            }
        });
        this.refresh_access_token = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const refresh_token = req.body.refresh_token;
                const access_token = yield this.services.refresh_access_token(refresh_token);
                res.status(200).send({
                    message: "Access token refreshed successfully",
                    data: { access_token },
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.get_profile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            try {
                const user_id = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                const user_auth = yield this.user_services.find_auth_by_id(user_id);
                const user = yield this.user_services.find_user_by_email(user_auth.email);
                res.status(200).json({ message: "Profile found", data: user });
            }
            catch (error) {
                next(error);
            }
        });
        this.services = new auth_service_1.default();
        this.session_services = new session_service_1.default();
        this.user_services = new user_service_1.default();
    }
}
const user_controller = new UserController();
exports.default = user_controller;
