import express from "express";
import cors from "cors";
import rate_limiter from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import settings from "./constants/settings";
import { logger } from "./configs/logger.config";
import { error_handler, not_found } from "./handlers/error.handler";

const app = express();

// middlewares
const ONE_MINUTE = 1000 * 60;
app.use(rate_limiter({ windowMs: ONE_MINUTE, max: 50 }));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all("*", not_found);
app.use(error_handler);

const port = settings.port as string;

mongoose.connect(settings.mongo.url as string).then(() => {
  app.listen(port, () => {
    logger.debug(`Server is listening on port ${port}`);
  });
});
