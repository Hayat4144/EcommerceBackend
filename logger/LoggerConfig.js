const { format, createLogger, transports } = require("winston");
const { combine, timestamp, printf } = format;

class LoggingConfig {
  constructor() {
    this.myFormat = printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    });
    this.enumerateErrorFormat = format((info) => {
      if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
      }
      return info;
    });
  }

  Developmentlogger() {
    return createLogger({
      level: "silly",
      format: combine(
        this.enumerateErrorFormat(),
        format.colorize(),
        timestamp(),
        this.myFormat
      ),
      transports: [
        new transports.Console({
          stderrLevels: ["error"],
        }),
      ],
    });
  }

  Productionlogger() {
    return createLogger({
      level: "info",
      format: combine(this.enumerateErrorFormat(), timestamp(), this.myFormat),
      transports: [
        new transports.Console({
          stderrLevels: ["error"],
        }),
        new transports.File({
          level: "error",
          filename: "logs/errors.log",
        }),
        new transports.File({
          level: "info",
          filename: "logs/combined.log",
        }),
      ],
    });
  }
}

module.exports = LoggingConfig;
