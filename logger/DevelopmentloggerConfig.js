const { createLogger, format, transports } = require("winston");
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

exports.Developmentlogger = () => {
  return createLogger({
    level: "silly",
    format: combine(
      enumerateErrorFormat(),
      format.colorize(),
      timestamp(),
      myFormat
    ),
    transports: [
      new transports.Console({
        stderrLevels: ["error"],
      }),
    ],
  });
};
