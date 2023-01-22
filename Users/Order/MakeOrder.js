const mongoose = require("mongoose");
const ProductVarient_Model = require("../../Shop/Product/model/Product_Varient");
const AsyncFunc = require("../../utils/AsyncFunc");
const ErrorHandler = require("../../utils/ErrorHandler");
const OrderModal = require("../Model/OrderModal");
const uuid = require("uuid").v4;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

exports.MakeOrder = AsyncFunc(async (req, res, next) => {
  const { products } = req.body;

  // ------------------------- iterate over the products to find its varient  ----------------------------- //
  const varients = await Promise.all(
    products.map(async (elements) => {
      const varient = await ProductVarient_Model.findById(elements.varientId);
      if (!varient) return next(new ErrorHandler("Product not found.", 400));
      return varient.toObject();
    })
  );

  // ------------------ create a product data array with varientId, quantiy --------------- //
  let productData = [];
  varients.forEach((element) => {
    products.forEach((product) => {
      if (
        element._id == product.varientId &&
        !productData.some((data) => data._id === element._id)
      ) {
        productData.push({ ...product, price: element.price });
      }
    });
  });

  // --------------- total Price ----------------- //
  const totalPrice = productData.reduce((accum, current) => {
    return accum + current.price * current.quantity;
  }, 0);

  // ------------------- create Order ---------------------- //
  const createOrder = await OrderModal.create({
    user: req.user_id,
    products: productData,
    totalPrice
  });

  // ---------------- if error while creating order throw it --------------------- //
  if (!createOrder) return next(new ErrorHandler(createOrder));

  // --------------------------- create customer ------------------------ //
  const createCustomer = await stripe.customers.create({
    email: req.email,
    payment_method: "pm_card_visa",
  });

  // ---------------------------- handle error if error occured while creating customers  --------------- //
  if (!createCustomer) return next(new ErrorHandler(createCustomer));

  //    --------------------------- create payment intents  ----------------------- //
  await stripe.paymentIntents
    .create(
      {
        amount: createOrder.totalPrice * 100, // ------------- stripe take price in cent so, multiply by 100  make it actual payment ---------- //
        currency: "INR",
        payment_method_types: ["card"],
        customer: createCustomer.id,
        receipt_email: "ihayat855@gmail.com",
        confirmation_method: "manual",
        shipping: {
          address: {
            city: "Siwan",
            line1: "Ismail shaheed road purani quilla pokhra",
            postal_code: 841210,
            state: "Bihar",
            country: "INDIA",
          },
          name: "Hayat ilyas",
        },
      },
      {
        idempotencyKey: uuid(), /// ----------------- avoid payment twice for the same order --------------------- //
      }
    )
    .then((response) => {
      return res.status(200).json({ data: response.id });
    })
    .catch((error) => HandleStripeError(next, error));
});

// cus_NAlXDFUY0HPOwP
