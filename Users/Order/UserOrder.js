const AsyncFunc = require("../../utils/AsyncFunc");
const ErrorHandler = require("../../utils/ErrorHandler");
const OrderModal = require("../Model/OrderModal");
exports.UserOrder = AsyncFunc(async (req, res, next) => {
  await OrderModal.find({ user: req.user_id })
  .populate({
    path: 'products.varientId',
    select: 'name price',
    populate: {
      path: 'product',
      select: 'name description assets'
    }
  })
    .then((orders) => {
      if (orders.length < 1)
        return next(
          new ErrorHandler("you have not ordered anything yet.", 400)
        );
      return res.status(200).json({ data: orders });
    })
    .catch((error) => {
      next(new ErrorHandler(error, 400));
    });
});

// .populate('products.varientId', 'name price')
//   .exec((err, orders) => {
//     if (err) return next(new ErrorHandler(err, 400));
//     return res.status(200).json({ data: orders });
//   });
