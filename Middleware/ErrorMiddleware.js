const ErrorHandler = require("../utils/ErrorHandler");
const logger = require("../utils/Logger");

exports.ErrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server";
  if (err.name === "CastError") {
    const message = `Invalid ${err.stringValue} of  ${err.kind} for ${err.path} `;
    err = new ErrorHandler(message, 400);
  }
  logger.error(err);
  res.status(err.statusCode).json({ error: err.message });
};
