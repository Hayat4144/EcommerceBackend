const category_model = require("../model/category_model");
const AsyncFunc = require("../../../utils/AsyncFunc");
const ErrorHandler = require("../../../utils/ErrorHandler");

// get all categories and subcategories
const CreateCategories = (categories, parent = null) => {
  const categoryList = [];
  let category;
  if (parent == undefined) {
    category = categories.filter((cat) => cat.parent == "/");
  } else {
    category = categories.filter((cat) => cat.parent == parent);
  }
  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      parent: cate.parent,
      category: cate.category,
      created_at: cate.created_at,
      updated_at: cate.updated_at,
      children: CreateCategories(categories, cate.category),
    });
  }
  return categoryList;
};

const Get_Categories = AsyncFunc(async (req, res, next) => {
  category_model.find({}).exec((err, document) => {
    if (err) return next(new ErrorHandler(err.message, 400));
    if (document.length < 1)
      return next(new ErrorHandler("you category has been found", 400));
    const categoryList = CreateCategories(document);
    return res.status(200).json({ data: categoryList });
  });
});

module.exports = Get_Categories;
