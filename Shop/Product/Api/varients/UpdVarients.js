const ProductVarient_Model = require('../../model/Product_Varient')
const ErrorHandler = require('../../../../utils/ErrorHandler')

exports.UpdataVarients = async (req, res, next) => {
    try {
        await ProductVarient_Model.findOneAndUpdate({ _id: req.body.varient_id, seller: req.user_id } ,{ $set: req.body }, { new: true })
            .exec((error, doc) => {
                if (error) {
                    return res.status(400).json({ "error": error.message })
                }
                else {
                    if (doc === null) {
                        return res.status(400).json({ 'error': `The product you trying to update does not exist.` })
                    }
                    return res.status(200).json({ "data": `The ${doc.product.name} product is updated successuflly.` })
                }
            })
    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
}