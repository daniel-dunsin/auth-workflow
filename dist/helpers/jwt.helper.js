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
const settings_1 = __importDefault(require("../constants/settings"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_responses_handler_1 = require("../handlers/error-responses.handler");
const logger_config_1 = require("../configs/logger.config");
class JWTHelpers {
    constructor() {
        this.readkeys = (key) => __awaiter(this, void 0, void 0, function* () {
            return yield Buffer.from(key, "base64").toString("ascii");
        });
        this.sign_access_token = (user_id) => __awaiter(this, void 0, void 0, function* () {
            const key = yield this.readkeys(settings_1.default.secret_keys.access_token);
            const TEN_MINUTES = "10m";
            const token = yield jsonwebtoken_1.default.sign({ user_id: user_id }, key, {
                expiresIn: TEN_MINUTES,
            });
            return token;
        });
        this.sign_refresh_token = (session_id) => __awaiter(this, void 0, void 0, function* () {
            const key = yield this.readkeys(settings_1.default.secret_keys.refresh_token);
            const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;
            const token = yield jsonwebtoken_1.default.sign({ session_id }, key, { expiresIn: ONE_YEAR });
            return token;
        });
        this.verify_refresh_token = (refresh_token) => __awaiter(this, void 0, void 0, function* () {
            try {
                const key = yield this.readkeys(settings_1.default.secret_keys.refresh_token);
                let token;
                yield jsonwebtoken_1.default.verify(refresh_token, key, (err, user) => {
                    if (err) {
                        logger_config_1.logger.error(err);
                        return;
                    }
                    token = user;
                });
                return token;
            }
            catch (error) {
                logger_config_1.logger.error(error.message);
                throw new error_responses_handler_1.UnAuthorizedError(error.message);
            }
        });
        this.verify_access_token = (access_token) => __awaiter(this, void 0, void 0, function* () {
            try {
                const key = yield this.readkeys(settings_1.default.secret_keys.access_token);
                let token;
                yield jsonwebtoken_1.default.verify(access_token, key, (err, user) => {
                    if (err) {
                        logger_config_1.logger.error(err);
                        return;
                    }
                    token = user;
                });
                return token;
            }
            catch (error) {
                logger_config_1.logger.error(error.message);
                throw new error_responses_handler_1.UnAuthorizedError(error.message);
            }
        });
    }
}
const Jwt_Helpers = new JWTHelpers();
exports.default = Jwt_Helpers;
