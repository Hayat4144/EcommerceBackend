const category_model = require('../model/category_model')

// get all categories and subcategories
const createCategories = (categories, parentId = null) => {
    const categoryList = [];
    let category;
    if (parentId == undefined) {
        category = categories.filter((cat) => cat.parentId == undefined);
    } else {
        category = categories.filter((cat) => cat.parentId == parentId);
    }
    for (let cate of category) {
        console.log(cate)
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            created_at: cate.created_at,
            updated_at: cate.updated_at,
            children: createCategories(categories, cate._id),
        });
    }
    return categoryList;
};

exports.Get_Categories = async (req, res) => {
    try {
        await category_model.find()
            .exec((error, categories) => {
                if (!error) {
                    const categoryList = createCategories(categories);
                    return res.status(200).json({ data: categoryList })
                }
                return res.status(400).json({ error })
            })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 'error': error })
    }
}