const category_model = require('../model/category_model')
const slugify = require('slugify')


exports.Create_Category = async (req, res) => {
    try {
        const Category_data = {
            name: req.body.name,
            slug: slugify(req.body.name)
        }
        req.body.parentId ? Category_data.parentId = req.body.parentId : Category_data;
        await category_model.create(Category_data, (err, data) => {
            return err ? res.status(400).json({ "error": err }) : res.status(200).json({ 'data': data })
        })
    } catch (error) {
        return res.status(400).json({error})
    }
}