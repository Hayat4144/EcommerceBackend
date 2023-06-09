const ErrorHandler = require("./ErrorHandler");

const HandleStripeError = (next, error) => {
  switch (error.type) {
    case "StripeCardError":
      return next(new ErrorHandler(error.message, 400));
    case "StripeRateLimitError":
      return next(
        new ErrorHandler("Too many requests made to the API too quickly", 400)
      );

    case "StripeInvalidRequestError":
      return next(
        new ErrorHandler(
          "Invalid parameters were supplied to Stripe's API",
          400
        )
      );
    case "StripeAPIError":
      return next(
        new ErrorHandler("An error occurred internally with Stripe's API", 400)
      );

    case "StripeConnectionError":
      return next(
        new ErrorHandler(
          "Some kind of error occurred during the HTTPS communication",
          400
        )
      );
    case "StripeAuthenticationError":
      return next(
        new ErrorHandler("You probably used an incorrect API key", 400)
      );

    default:
      return next(new ErrorHandler(error, 400));
  }
};

module.exports = HandleStripeError;
