import winston from "winston";
import path from "path";
import fs from "fs";

// Create logs directory if not exists
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const colors = {
  error: "red",
  warn: "yellow",
  info: "cyan",
  http: "green",
  verbose: "magenta",
  debug: "white",
  silly: "grey",
};
winston.addColors(colors);

const logFormat = winston.format.printf(
  ({ timestamp, level, message }) =>
    `${timestamp} [${level}] : ${message}`
);

const logger = winston.createLogger({
  level: "silly",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss A" })
  ),

  transports: [
    // All logs
    new winston.transports.File({
      filename: path.join(logDir, "all.log"),
      level: "silly",
      format: winston.format.combine(winston.format.uncolorize(), logFormat),
    }),

    // Error logs only
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      format: winston.format.combine(winston.format.uncolorize(), logFormat),
    }),

    // Warning logs only
    new winston.transports.File({
      filename: path.join(logDir, "warn.log"),
      level: "warn",
      format: winston.format.combine(winston.format.uncolorize(), logFormat),
    }),

    // Info logs only
    new winston.transports.File({
      filename: path.join(logDir, "info.log"),
      level: "info",
      format: winston.format.combine(winston.format.uncolorize(), logFormat),
    }),

    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss A" }),
        logFormat
      ),
    }),
  ],
});

export default logger;
