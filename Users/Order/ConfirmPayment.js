const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const AsyncFunc = require("../../utils/AsyncFunc");
const ErrorHandler = require("../../utils/ErrorHandler");
const OrderModal = require("../Model/OrderModal");
const ProductVarient_Model = require('../../Shop/Product/model/Product_Varient')

exports.ConfirmPayment = AsyncFunc(async (req, res, next) => {
  const { token, payment_intentId, orderId, payment_type, products } = req.body;
  switch (payment_type) {
    case "CASHONDELIVARY":
      // ------------------------- iterate over the products to find its varient  ----------------------------- //
      const varients = await Promise.all(
        products.map(async (elements) => {
          const varient = await ProductVarient_Model.findById(
            elements.varientId
          );
          if (!varient)
            return next(new ErrorHandler("Product not found.", 400));
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
        totalPrice,
      });
      console.log(createOrder)
      // ---------------- if error while creating order throw it --------------------- //
      if (!createOrder) return next(new ErrorHandler(createOrder));
      return res.status(200).json({data:"your order has been placed successfully."})
    case "CARD":
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
              if (error) return next(new ErrorHandler(error, 400));
              return res
                .status(200)
                .json({ data: "your order has been placed successfully." });
            }
          );
        })
        .catch((error) => {
          if (error) return next(new ErrorHandler(error.message, 400));
        });
      break;
  }
});
