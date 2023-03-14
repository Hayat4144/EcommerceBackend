const AsyncFunc = require("../../utils/AsyncFunc");
const OrderModal = require("../../Users/Model/OrderModal");
const ErrorHandler = require('../../utils/ErrorHandler')

exports.UpdateOrder = AsyncFunc(async (req, res, next) => {
    let { status, Orderid } = req.body;
    const IsValidSeller = await OrderModal.find({ 'products.seller': req.user_id });
    if (!IsValidSeller) return next(new ErrorHandler("you are unauthorised", 401))
    OrderModal.findByIdAndUpdate(Orderid, { $set: { status: status } }, { new: true }, (error, doc) => {
        if (error) return next(new ErrorHandler(error.message, 400));
        if (doc !== null && doc !== undefined) {
            console.log(doc);
            return res.status(200).json({ data: "Order has been updated successfully." })
        }
    })
})