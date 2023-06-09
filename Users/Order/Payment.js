const AsyncFunc = require("../../utils/AsyncFunc");
const ProductVarient_Model = require("../../Shop/Product/model/Product_Varient");
const OrderModal = require("../Model/OrderModal");
const ErrorHandler = require("../../utils/ErrorHandler");
const IsProductExist = require("../../utils/IsProductExist");
const logger = require("../../utils/Logger");
const HandleStripeError = require("../../utils/HandleStripeError");
const StripeCustomer = require("../../utils/StripeCustomer");
const isPaymentMethodAttached = require("../../utils/isPaymentMethodAttached");
const attachPaymentMethodToCustomer = require("../../utils/attachPaymentMethodToCustomer");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const uuid = require("uuid").v4;

const Payment = AsyncFunc(async (req, res, next) => {
  const { payment_type, products, paymentMethodId } = req.body;
  const varientIds = products
    .filter((product) => product.varientId)
    .map((product) => product.varientId);

  const variants = await ProductVarient_Model.find({
    _id: { $in: varientIds },
  }).select("price _id seller");

  const variantMap = variants.reduce((map, variant) => {
    map[variant._id.toString()] = variant;
    return map;
  }, {});

  const productData = [];

  const ProductPromise = products.map(async (product) => {
    const { ProductId, varientId, quantity } = product;
    const productInfo = await IsProductExist(ProductId);
    if (!productInfo) return next(new ErrorHandler(`Product not found`, 400));

    const productDataItem = {
      ProductId,
      price: productInfo.price,
      seller: productInfo.seller,
      quantity,
    };

    if (varientId) {
      const variant = variantMap[varientId];
      if (!variant) return next(new ErrorHandler(`Variant not found.`, 400));
      productDataItem.price = variant.price;
      productDataItem.seller = variant.seller;
      productDataItem.varientId = varientId;
    }

    productData.push(productDataItem);
  });

  await Promise.all(ProductPromise);

  const totalPrice = productData.reduce((sum, product) => {
    const { price, quantity } = product;
    return sum + price * quantity;
  }, 0);

  const NewOrder = await OrderModal.create({
    user: req.user_id,
    products: productData,
    totalPrice,
    payment_type,
  });

  const customer = await StripeCustomer(req.email, req.name);

  const isAttached = await isPaymentMethodAttached(
    customer.id,
    paymentMethodId
  );

  if (!isAttached) {
    await attachPaymentMethodToCustomer(customer.id, paymentMethodId);
    console.log("attach customer confirm");
  }

  stripe.paymentIntents
    .create(
      {
        payment_method_types: ["card"],
        amount: NewOrder.totalPrice * 100,
        currency: "INR",
        customer: customer.id,
        receipt_email: req.email,
        confirmation_method: "manual",
        payment_method: paymentMethodId,
        metadata: {
          order_id: NewOrder._id.toString(),
        },
      },
      { idempotencyKey: uuid() }
    )
    .then((paymentIntent) => {
      return res.status(200).json({
        client_secret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    })
    .catch(async (error) => {
      await OrderModal.findByIdAndDelete(NewOrder._id);
      HandleStripeError(next, error);
    });
});

module.exports = Payment;
