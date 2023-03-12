const OrderModal = require("../../Users/Model/OrderModal");
const AsyncFunc = require("../../utils/AsyncFunc");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.ReadOrder = AsyncFunc(async (req, res, next) => {
    const { orderId } = req.query;
    OrderModal.findById(orderId)
        .populate({
            path: 'products.varientId',
            select: 'product product_attribute',
            populate: {
                path: 'product',
                select: 'assets name price description'
            }
        }).exec((err, doc) => {
            if (err) return next(new ErrorHandler(err.message, 400));
            console.log(doc);
            if (doc.length === 0) return res.status(404).json({ data: 'No order data found' });
            return res.status(200).json({ data: doc })
        })
})