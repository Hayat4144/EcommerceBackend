const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const AsyncFunc = require("../../utils/AsyncFunc");
const ErrorHandler = require("../../utils/ErrorHandler");
const OrderModal = require("../Model/OrderModal");

exports.ConfirmPayment = AsyncFunc(async (req, res, next) => {
  const { token, payment_intentId, orderId } = req.body;
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
      OrderModal.findByIdAndUpdate(
        orderId,
        { $set: { status: "processing" } },
        { new: true },
        (error, doc) => {
          if(error) return next(new ErrorHandler(error,400))
          return res.status(200).json({ data: "Order has been completed." });
        }
      );
     
    })
    .catch((error) => {
      if (error) return next(new ErrorHandler(error.message, 400));
    });
});
