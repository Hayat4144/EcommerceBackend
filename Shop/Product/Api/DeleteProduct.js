const Product_Model = require('../model/Product_Model')

exports.DeleteProduct = async (req, res) => {
    try {
        await Product_Model.findOneAndDelete({ _id: req.body.product_id, seller: req.user_id })
            .exec((error, docs) => {
                if (error) {
                    return res.status(400).json({ "error": error.message })
                }
                else {
                    if (docs === null) {
                        return res.status(400).json({ 'error': `The product you trying to delete does not exist.` })
                    }
                    return res.status(200).json({ "data": `The ${docs.name} product is deleted successuflly.` })
                }
            })
    } catch (error) {
        console.log(error)
    }
}