const { format, createLogger, transports } = require("winston");
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

exports.ProductionloggerConfig = () => {
  return createLogger({
    level: "info",
    format: combine(enumerateErrorFormat(), timestamp(), myFormat),
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
};
