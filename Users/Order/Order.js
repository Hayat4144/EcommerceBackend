const logger = require("../../utils/Logger");
const AsyncFunc = require("../../utils/AsyncFunc");
const ProductVarient_Model = require("../../Shop/Product/model/Product_Varient");
const OrderModal = require("../Model/OrderModal");
const ErrorHandler = require("../../utils/ErrorHandler");
const IsProductExist = require("../../utils/IsProductExist");

const Order = AsyncFunc(async (req, res, next) => {
  const { products, payment_type } = req.body;

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

  return res.status(200).json({ data: "Order has been placed successfully." });
});

module.exports = Order;
