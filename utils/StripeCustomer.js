const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const uuid = require("uuid").v4;

const StripeCustomer = async (email, name) => {
  const existingCustomers = await stripe.customers.list({
    email: email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    const customer = existingCustomers.data[0];
    return customer;
  } else {
    const newCustomer = await stripe.customers.create(
      {
        email: email,
        name: name,
      },
      { idempotencyKey: uuid() }
    );

    return newCustomer;
  }
};

module.exports = StripeCustomer;
