import winston from "winston";
const { combine, timestamp, printf, align } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss",
    }),
    align(),
    printf(
      (info) =>
        `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console(),

    new winston.transports.File({
      filename: "app.log",
      level: "info",
    }),

    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
  ],
});

export default logger;
