"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCache = void 0;
const TEN_MINUTES = 1000 * 60 * 10;
const setCache = (req, res, next) => {
    if (req.method === "GET") {
        res.set("Cache-Control", `public, max-age=${TEN_MINUTES}`);
    }
    else {
        res.removeHeader("Cache-Control");
    }
    next();
};
exports.setCache = setCache;
