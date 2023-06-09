const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const attachPaymentMethodToCustomer = async (customerId, paymentMethodId) => {
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });
};

module.exports = attachPaymentMethodToCustomer;