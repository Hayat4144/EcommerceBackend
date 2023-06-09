const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const isPaymentMethodAttached = async (customerId, paymentMethodId) => {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });

  const attachedPaymentMethods = paymentMethods.data.filter(
    (pm) => pm.id === paymentMethodId
  );

  return attachedPaymentMethods.length > 0;
};

module.exports = isPaymentMethodAttached;
