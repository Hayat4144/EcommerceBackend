const category_model = require('../model/category_model')

exports.Get_Categories = async (req, res) => {
    try {
        await category_model.find()
            .exec((error, categories) => {
                if (!error) {
                    return res.status(200).json({ categories })
                }
                return res.status(400).json({ error })
            })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 'error': error })
    }
}