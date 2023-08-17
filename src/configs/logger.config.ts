import pino from "pino";
import day from "dayjs";
import pino_pretty from "pino-pretty";

export const logger = pino(pino_pretty());
