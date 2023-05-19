const LoggerConfiguration = require("./LoggerConfiguration");

let Winston_logger_config = new LoggerConfiguration();

let logger;

process.env.NODE_ENV !== "production"
  ? (logger = Winston_logger_config.DevelopmentConfig())
  : (logger = Winston_logger_config.ProductionConfig());

module.exports = logger;
