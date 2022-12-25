const AsyncFunc = require("../../../utils/AsyncFunc");
const ErrorHandler = require("../../../utils/ErrorHandler");
const ProductModel = require("../model/Product_Model");

exports.FetchProductById = AsyncFunc(async (req, res, next) => {
    const { id } = req.params;
    await ProductModel.findById(id)
        .exec((error, data) => {
            if (error) {
                next(new ErrorHandler(error.message, 400))
            }
            else {
                if (data === null) {
                    next(new ErrorHandler("No product found", 400))
                }
                else {
                    return res.status(200).json({ data })
                    // return res.status(200).json({ data: data })
                }

            }
        })
})