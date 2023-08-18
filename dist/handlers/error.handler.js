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
Object.defineProperty(exports, "__esModule", { value: true });
exports.not_found = exports.error_handler = exports.CustomError = void 0;
class CustomError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message = message;
    }
}
exports.CustomError = CustomError;
const error_handler = (error, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (error instanceof CustomError) {
        return res.status(error.code).send({ error: error.message });
    }
    res.status(500).send({ error });
});
exports.error_handler = error_handler;
const not_found = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(404).send({ error: "Route does not exist" });
});
exports.not_found = not_found;
