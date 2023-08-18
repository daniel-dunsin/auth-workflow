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
const jwt_helper_1 = __importDefault(require("../helpers/jwt.helper"));
const is_auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const header = req.headers["authorization"];
    if (!header || !header.startsWith("Bearer ")) {
        return next(new error_responses_handler_1.UnAuthorizedError("Provide token"));
    }
    const token = header.split(" ")[1];
    if (!token) {
        return next(new error_responses_handler_1.UnAuthorizedError("Provide token"));
    }
    const decoded = yield jwt_helper_1.default.verify_access_token(token);
    if (!decoded) {
        return next(new error_responses_handler_1.UnAuthorizedError("Invalid token"));
    }
    req.user = {
        id: decoded.user_id,
    };
    next();
});
exports.default = is_auth;
