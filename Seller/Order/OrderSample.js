const OrderModal = require("../../Users/Model/OrderModal");
const AsyncFunc = require("../../utils/AsyncFunc");
const ErrorHandler = require('../../utils/ErrorHandler')

exports.SellerOrder = AsyncFunc(async (req, res, next) => {
    let { from, to } = req.body;
    from = new Date(from).toISOString();
    to = new Date(to).toISOString();
    OrderModal.find({ 'products.seller': req.user_id, "date": { $gte: from, $lte: to } }).exec((err, doc) => {
        if (err) return next(new ErrorHandler(err.message, 400));
        console.log(doc);
        if (doc.length === 0) return res.status(404).json({ data: 'No order data found' });
        return res.status(200).json({ data: doc })
    })
})