"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const user_interface_1 = require("../interfaces/models/user.interface");
const settings_1 = __importDefault(require("../constants/settings"));
const uuid_1 = require("uuid");
const TEN_MINUTES = 1000 * 60 * 10;
const TokenSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: settings_1.default.mongo.collections.auth,
    },
    token: {
        type: String,
        required: true,
        default: (0, uuid_1.v4)(),
    },
    type: {
        type: String,
        enum: [user_interface_1.IToken.password_reset_token, user_interface_1.IToken.verify_otp_token],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: TEN_MINUTES,
    },
});
const Token = mongoose_1.default.model(settings_1.default.mongo.collections.token, TokenSchema);
exports.default = Token;
