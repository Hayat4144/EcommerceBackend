const AsyncFunc = require("../../utils/AsyncFunc");
const OrderModal = require("../../Users/Model/OrderModal");
const ErrorHandler = require('../../utils/ErrorHandler')

exports.TotalOrders = AsyncFunc(async (req, res, next) => {
    OrderModal.find({ "products.seller": req.user_id }).count().exec((err, doc) => {
        if (err) return next(new ErrorHandler(err.message, 400));
        return res.status(200).json({ data: doc })
    })
})


exports.TodayOrders = AsyncFunc(async (req, res, next) => {
    let today_date = new Date();
    today_date.toISOString()
    OrderModal.find({ 'products.seller': req.user_id, 'date': today_date }).count().exec((error,doc)=>{
        if(error) return next(new ErrorHandler(error.message,400));
        return res.status(200).json({data:doc})
    })
})