const AsyncFunc = require('../../../utils/AsyncFunc')
const ErrorHandler = require('../../../utils/ErrorHandler')
const ProductModel = require('../model/Product_Model')
const mongoose = require('mongoose')

exports.SimilarProducts = (AsyncFunc(async (req, res, next) => {
    const { search, productId, categoryId } = req.body;
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
        {
            $match: {
                category: mongoose.Types.ObjectId(categoryId),
                _id: { $ne: mongoose.Types.ObjectId(productId) }
            }
        }
    ], (error, data) => {
        if (error) return next(new ErrorHandler(error, 400));
        return res.status(200).json({ data })
    })
}))