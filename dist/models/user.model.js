"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const settings_1 = __importDefault(require("../constants/settings"));
const UserSchema = new mongoose_1.default.Schema({
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    phone_number: { type: Number, required: true, unique: true },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true });
const User = mongoose_1.default.model(settings_1.default.mongo.collections.user, UserSchema);
exports.default = User;
