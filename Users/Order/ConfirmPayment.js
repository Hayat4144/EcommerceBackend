const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const AsyncFunc = require("../../utils/AsyncFunc");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.ConfirmPayment = AsyncFunc(async (req, res, next) => {
  const { token, payment_intentId } = req.body;
  await stripe.paymentIntents
    .confirm(payment_intentId, {
      payment_method_data: {
        type: "card",
        card: {
          token: token.id,
        },
      },
    })
    .then((result) => {
      return res.status(200).json({ data: "order Confirm" });
    })
    .catch((error) => {
      if (error) return next(new ErrorHandler(error.message, 400));
    });
});
