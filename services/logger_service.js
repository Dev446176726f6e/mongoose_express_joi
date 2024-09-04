const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, prettyPrint, colorize } = format;
require("winston-mongodb");

const config = require("config");

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level} ${message}`;
});

const logger = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.Console({
      level: "debug",
      format: combine(colorize()),
      format,
    }),
    new transports.File({ filename: "log/error.log", level: "error" }),
    new transports.File({ filename: "log/combine.log", level: "debug" }),
  ],
});

logger.exitOnError = false;

logger.exceptions.handle(new transports.File({ filename: "./log/exceptions" }));

module.exports = logger;
