
const ErrorHandler = require("../utils/ErrorHandler");
const logger = require("../utils/Logger");

exports.ErrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server";
  switch (err.type) {
    case "StripeCardError":
      err.statusCode = 400;
      break;
    case "StripeRateLimitError":
      err.message = "Too many requests made to the API too quickly";
      err.statusCode = 400;
      break;

    case "StripeInvalidRequestError":
      console.log(err)
      err.message = "Invalid parameters were supplied to Stripe's API";
      err.statusCode = 400;
      break;
    case "StripeAPIError":
      err.message = "An error occurred internally with Stripe's API";
      err.statusCode = 400;
      break;
    case "StripeConnectionError":
      err.message =
        "Some kind of error occurred during the HTTPS communication";
      err.statusCode = 400;
      break;
    case "StripeAuthenticationError":
      err.message = "You probably used an incorrect API key";
      err.statusCode = 400;
      break;
    case "StripePermissionError":
      err.message = "You probably used an incorrect API key";
      err.statusCode = 400;
      break;
    default:
      err.statusCode = 400;
  }
  if (err.name === "CastError") {
    const message = `Invalid ${err.stringValue} of  ${err.kind} for ${err.path} `;
    err = new ErrorHandler(message, 400);
  }
  logger.error(err);
  res.status(err.statusCode).json({ error: err.message });
};
