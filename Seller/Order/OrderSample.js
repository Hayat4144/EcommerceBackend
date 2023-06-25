const OrderModal = require("../../Users/Model/OrderModal");
const AsyncFunc = require("../../utils/AsyncFunc");
const ErrorHandler = require("../../utils/ErrorHandler");
const logger = require("../../utils/Logger");
const Pagination = require("../../utils/Pagination");

exports.SellerOrder = AsyncFunc(async (req, res, next) => {
  let { from, to, page } = req.body;
  from = new Date(new Date(from)).setUTCHours(0, 0, 0, 0);
  to = new Date(new Date(to)).setUTCHours(23, 59, 59, 999);

  // find orders based on the data and add pagination 
  const OrderData = await OrderModal.find({
    "products.seller": req.user_id,
    date: { $gte: from, $lte: to },
  })
    .limit(20)
    .skip(Pagination(page, 20));

  if (OrderData.length < 1) {
    return res.status(400).json({ data: "No order has been found" });
  }
  const getCountDocuments = await OrderModal.countDocuments({
    "products.seller": req.user_id,
    date: { $gte: from, $lte: to },
  });
  return res
    .status(200)
    .json({ data: OrderData, totalOrders: getCountDocuments });
});
