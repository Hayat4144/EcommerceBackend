const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const AsyncFunc = require("../../utils/AsyncFunc");
const OrderModal = require("../Model/OrderModal");

const ConfirmPayment = AsyncFunc(async (req, res, next) => {
  const { paymentMethodId, payment_intentId } = req.body;
  const confirmpayment = await stripe.paymentIntents.confirm(payment_intentId, {
    payment_method: paymentMethodId,
  });

  if (confirmpayment.status === "succeeded") {
    const UpdateOrder = await OrderModal.findByIdAndUpdate(
      confirmpayment.metadata.order_id,
      {
        $set: { paymentStatus: "paid", payment_intentId: confirmpayment.id },
      }
    );
  }
  return res.status(200).json({ data: confirmpayment });
});

module.exports = ConfirmPayment;
