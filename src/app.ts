import express from "express";
import cors from "cors";
import rate_limiter from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import settings from "./constants/settings";
import { logger } from "./configs/logger.config";
import { error_handler, not_found } from "./handlers/error.handler";
import { setCache } from "./configs/cache.config";
import auth_routes from "./routes/user.routes";
import swagger from "swagger-ui-express";
import path from "path";
const api_doc = require("./configs/api.config.json");

const app = express();

app.set("views", path.join(__dirname, "./views"));

// middlewares
const ONE_MINUTE = 1000 * 60;
app.use(rate_limiter({ windowMs: ONE_MINUTE, max: 50 }));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(setCache);

app.set("view engine", "ejs");

// routes
app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "./templates/index.html"));
});
app.use("/api/auth", auth_routes);
app.use("/doc", swagger.serve, swagger.setup(api_doc));

app.all("*", not_found);
app.use(error_handler);

const port = settings.port as string;

mongoose.connect(settings.mongo.url as string).then(() => {
  app.listen(port, () => {
    logger.info(`Server is listening on port ${port}`);
  });
});
