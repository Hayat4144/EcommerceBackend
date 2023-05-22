const AsyncFunc = require('../../../utils/AsyncFunc')
const ErrorHandler = require('../../../utils/ErrorHandler')
const ProductModel = require('../model/Product_Model')

exports.SampleProducts = (AsyncFunc(async (req, res, next) => {
    const { search } = req.query;
    ProductModel.aggregate([
        {
            $search: {
                text: {
                    query: search,
                    path: "name",
                    fuzzy: {
                        maxEdits: 2
                    }
                }
            }
        },
        {$limit:10}
    ], (error, data) => {
        if (error) return next(new ErrorHandler(error, 400));
        return res.status(200).json({ data })
    })
}))