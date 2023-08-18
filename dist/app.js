"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const settings_1 = __importDefault(require("./constants/settings"));
const logger_config_1 = require("./configs/logger.config");
const error_handler_1 = require("./handlers/error.handler");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const api_doc = require("./configs/api.config.json");
const app = (0, express_1.default)();
// middlewares
const ONE_MINUTE = 1000 * 60;
app.use((0, express_rate_limit_1.default)({ windowMs: ONE_MINUTE, max: 50 }));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// app.use(setCache);
// routes
app.use("/api/auth", user_routes_1.default);
app.use("/doc", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(api_doc));
app.all("*", error_handler_1.not_found);
app.use(error_handler_1.error_handler);
const port = settings_1.default.port;
mongoose_1.default.connect(settings_1.default.mongo.url).then(() => {
    app.listen(port, () => {
        logger_config_1.logger.info(`Server is listening on port ${port}`);
    });
});
