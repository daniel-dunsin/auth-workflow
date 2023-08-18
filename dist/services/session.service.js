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
const error_responses_handler_1 = require("../handlers/error-responses.handler");
const session_model_1 = __importDefault(require("../models/session.model"));
const user_service_1 = __importDefault(require("./user.service"));
class SessionService {
    constructor() {
        this.create_session = (user) => __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield session_model_1.default.findOne({ user });
                let result;
                if (session) {
                    session.live = true;
                    result = yield session.save();
                }
                else {
                    result = yield session_model_1.default.create({ user });
                }
                return result;
            }
            catch (error) {
                throw new error_responses_handler_1.BadRequestError("Unable to create user session");
            }
        });
        this.update_session = (session_id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield session_model_1.default.findById(session_id);
                let result;
                if (session) {
                    session.live = true;
                    result = yield session.save();
                    return result;
                }
            }
            catch (error) {
                throw new error_responses_handler_1.BadRequestError("Unable to update user session");
            }
        });
        this.logout_session = (user) => __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield session_model_1.default.findOne({ user });
                let result;
                if (session) {
                    session.live = false;
                    result = yield session.save();
                    return result;
                }
            }
            catch (error) {
                throw new error_responses_handler_1.BadRequestError("Unable to logout user session");
            }
        });
        this.user_service = new user_service_1.default();
    }
}
exports.default = SessionService;
