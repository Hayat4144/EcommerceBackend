const { Developmentlogger } = require("./DevelopmentloggerConfig");
const { ProductionloggerConfig } = require("./Productionlogger");

let logger = null;
process.env.NODE_ENV === "production"
  ? (logger = ProductionloggerConfig())
  : (logger = Developmentlogger());

module.exports = logger;
