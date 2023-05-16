const LoggerConfiguration = require('./LoggerConfig')

let  LoggerConfig = new LoggerConfiguration();

let logger = null;
process.env.NODE_ENV === "production"
  ? (logger = LoggerConfig.Productionlogger())
  : (logger = LoggerConfig.Developmentlogger());

module.exports = logger;
