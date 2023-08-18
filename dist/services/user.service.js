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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const user_auth_model_1 = __importDefault(require("../models/user.auth.model"));
const error_responses_handler_1 = require("../handlers/error-responses.handler");
class UserService {
    constructor() {
        this.create_user = (body) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, firstname, lastname, password, email, phone_number } = body;
                yield user_model_1.default.create({ username, email, lastname, firstname, phone_number });
                const user = yield user_auth_model_1.default.create({ username, email, password });
                return user;
            }
            catch (error) {
                console.log(error);
                if (error.code === 11000) {
                    throw new error_responses_handler_1.BadRequestError("A user with this email, username or phone number exists");
                }
                throw new error_responses_handler_1.BadRequestError(error.message);
            }
        });
        this.find_auth_by_id = (_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_auth_model_1.default.findById(_id);
                if (!user) {
                    throw new error_responses_handler_1.NotFoundError("User does not exist");
                }
                const _a = user.toObject(), { password, verified } = _a, rest = __rest(_a, ["password", "verified"]);
                return rest;
            }
            catch (error) {
                throw new error_responses_handler_1.BadRequestError(error.message);
            }
        });
        this.find_auth_by_email = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_auth_model_1.default.findOne({ email });
                if (!user) {
                    throw new error_responses_handler_1.NotFoundError("User does not exist");
                }
                const _b = user.toObject(), { password, verified } = _b, rest = __rest(_b, ["password", "verified"]);
                return rest;
            }
            catch (error) {
                throw new error_responses_handler_1.BadRequestError(error.message);
            }
        });
        this.find_auth_by_username = (username) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_auth_model_1.default.findOne({ username });
                if (!user) {
                    throw new error_responses_handler_1.NotFoundError("User does not exist");
                }
                const _c = user.toObject(), { password, verified } = _c, rest = __rest(_c, ["password", "verified"]);
                return rest;
            }
            catch (error) {
                throw new error_responses_handler_1.BadRequestError(error.message);
            }
        });
        this.find_user_by_email = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({ email });
                if (!user) {
                    throw new error_responses_handler_1.NotFoundError("User does not exist");
                }
                return user;
            }
            catch (error) {
                throw new error_responses_handler_1.BadRequestError(error.message);
            }
        });
        this.find_user_by_id = (_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findById(_id);
                if (!user) {
                    throw new error_responses_handler_1.NotFoundError("User does not exist");
                }
                return user;
            }
            catch (error) {
                throw new error_responses_handler_1.BadRequestError(error.message);
            }
        });
        this.verify_user = (_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_auth_model_1.default.findById(_id);
                if (!user) {
                    throw new error_responses_handler_1.NotFoundError("User does not exist");
                }
                if (user.verified) {
                    throw new error_responses_handler_1.ForbiddenError("User is already verified");
                }
                user.verified = true;
                yield user.save();
            }
            catch (error) {
                throw new error_responses_handler_1.BadRequestError(error.message);
            }
        });
        this.reset_password = (_id, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_auth_model_1.default.findById(_id);
                if (!user) {
                    throw new error_responses_handler_1.NotFoundError("User does not exist");
                }
                user.password = password;
                yield user.save();
            }
            catch (error) {
                throw new error_responses_handler_1.BadRequestError(error.message);
            }
        });
    }
}
exports.default = UserService;
