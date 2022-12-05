const category_model = require('../model/category_model')

exports.DeleteCategory = async (req, res) => {
    try {
        await category_model.findByIdAndDelete(req.body.category_id)
            .exec((error, docs) => {
                if (error) {
                    return res.status(400).json({ "error": error.message })
                }
                else {
                    if (docs === null) {
                        return res.status(400).json({ 'error': `The category does not exist.` })
                    }
                    return res.status(200).json({ "data": `The ${docs.name} category is deleted successuflly.` })
                }
            })
    } catch (error) {
        console.log(error)
    }

}