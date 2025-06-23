import { pino, type Logger } from "pino";

export var logger: Logger = pino();

export function setLogger(alogger: Logger) {
  logger = alogger;
}
