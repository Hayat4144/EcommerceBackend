const AsyncFunc = require("../../utils/AsyncFunc");
const OrderModal = require("../../Users/Model/OrderModal");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.TotalOrders = AsyncFunc(async (req, res, next) => {
  OrderModal.find({ "products.seller": req.user_id })
    .count()
    .exec((err, doc) => {
      if (err) return next(new ErrorHandler(err.message, 400));
      return res.status(200).json({ data: doc });
    });
});

exports.TodayOrders = AsyncFunc(async (req, res, next) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  OrderModal.find({
    "products.seller": req.user_id,
    "date": {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }).count().exec((error, doc) => {
    if (error) return next(new ErrorHandler(error.message, 400));
    return res.status(200).json({ data: doc });
  });
});
