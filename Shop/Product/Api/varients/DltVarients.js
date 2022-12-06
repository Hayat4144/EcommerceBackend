const ProductVarient_Model = require('../../model/Product_Varient')
const ErrorHandler = require('../../../../utils/ErrorHandler')

exports.DeleteVarients = async (req, res, next) => {
    try {
        await ProductVarient_Model.findOneAndDelete({ _id: req.body.varient_id, seller: req.user_id })
            .exec((error, docs) => {
                if (error) {
                    return res.status(400).json({ "error": error.message })
                }
                else {
                    if (docs === null) {
                        return res.status(400).json({ 'error': `The product varient you trying to delete does not exist.` })
                    }
                    return res.status(200).json({ "data": `The product varient has been deleted successuflly.` })
                }
            })
    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
}