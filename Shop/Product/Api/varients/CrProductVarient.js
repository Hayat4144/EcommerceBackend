const ProductVarient_Model = require('../..//model/Product_Varient')
const ErrorHandler = require('../../../../utils/ErrorHandler')

exports.CreateProductVarient = async (req, res, next) => {
    try {
        const {price, product, stock, image, product_attribute } = req.body;
        await ProductVarient_Model.create({
            product,
            price,
            image,
            stock,
            product_attribute,
            seller: req.user_id
        }, (err, doc) => {
            console.log(doc.seller)
            return !err ? res.status(200).json({ doc }) : res.status(400).json({ err })
        })
    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
}