const Product_Model = require('../model/Product_Model')

exports.UpdateProduct = async (req, res) => {
    try {
        const seller_id = req.user_id;
        await Product_Model.findOneAndUpdate({ _id: req.body.product_id, seller: seller_id }, { $set: req.body }, { new: true })
            .exec((error, doc) => {
                if (error) {
                    return res.status(400).json({ "error": error.message })
                }
                else {
                    if (doc === null) {
                        return res.status(400).json({ 'error': `The product you trying to update does not exist.` })
                    }
                    return res.status(200).json({ "data": `The ${doc.name} product is updated successuflly.` })
                }
            })
    } catch (error) {
        console.log(error)
    }
}