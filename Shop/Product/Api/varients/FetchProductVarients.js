const ProductVarient_Model = require('../../model/Product_Varient')
const ErrorHandler = require('../../../../utils/ErrorHandler')
const AsyncFunc = require('../../../../utils/AsyncFunc')

// fetch all product
exports.Get_All_ProductVarients = async (req, res, next) => {
    try {
        await ProductVarient_Model.find({ seller: req.user_id })
            .exec((error, doc) => {
                return error ? res.status(400).json({ error }) : res.status(200).json({ doc })
            })
    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
}

// fetch product by  product id or prodcut varient id
exports.fetch_Product_By_Id_Or_ProductId = async (req, res, next) => {
    try {
        await ProductVarient_Model.find({ seller: req.user_id, _id: req.body.varient_id })
            .exec((error, doc) => {
                if (error) {
                    return res.status(400).json({ "error": error.message })
                }
                else {
                    if (doc.length === 0) {
                        return res.status(400).json({ error: "Sorry product does not exist" })
                    }
                    return res.status(200).json({ doc })
                }
            })
    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
}

exports.fetchProductVarient = AsyncFunc(async (req, res, next) => {
    await ProductVarient_Model.find({ product: req.params.id })
        .exec((error, data) => {
            if (error) {
                next(new ErrorHandler(error.message, 400))
            }
            else {
                console.log(data.length)
                if (data.length === 0) {
                    return next(new ErrorHandler("No varient available", 400))
                }
                else {
                    return res.status(200).json({ data: data })
                }

            }
        })
})