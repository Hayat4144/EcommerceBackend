const { createLogger, transport, format, transports } = require("winston");
const util = require("util");
const { combine, timestamp, printf, colorize } = format;

class LoggerConfiguration {
  constructor() {
    this.customloggerformat = printf((info) => {
      let message;
      if (info.message instanceof Object || info instanceof Object) {
        message = util.inspect(info.message, {
          compact: true,
          depth: Infinity,
        });
        message = info.stack ? ` ${message} \n ${info.stack}` : message;
      } else {
        message = info.stack
          ? `${info.message} \n ${info.stack}`
          : info.message;
      }
      return `${info.timestamp} [${info.level}] ${message}`;
    });

    this.enumerateErrorFormat = format((info) => {
      if (info instanceof Error) {
        Object.assign(info, { message: info.message, stack: info.stack });
      }
      return info;
    });
  }

  DevelopmentConfig() {
    return createLogger({
      level: "silly",
      format: combine(
        this.enumerateErrorFormat(),
        colorize(),
        timestamp(),
        this.customloggerformat
      ),
      transports: [new transports.Console()],
    });
  }

  ProductionConfig() {
    return createLogger({
      level: "info",
      format: combine(
        this.enumerateErrorFormat(),
        timestamp(),
        this.customloggerformat
      ),
      transports: [
        new transports.Console({ level: "info" }),
        new transports.File({ filename: "logs/error.log", level: "error" }),
        new transports.File({ filename: "logs/info.log", level: "info" }),
        new transports.File({
          filename: "logs/combind.log",
          level: "debug",
        }),
      ],
    });
  }
}

module.exports = LoggerConfiguration;
