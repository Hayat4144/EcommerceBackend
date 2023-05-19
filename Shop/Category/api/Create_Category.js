const CategoryModal = require("../model/category_model");
const AsyncFunc = require("../../../utils/AsyncFunc");
const ErrorHandler = require("../../../utils/ErrorHandler");

const CreateCategory = AsyncFunc(async (req, res, next) => {
  let { name, parent } = req.body;
  if (name) name.trim();
  if (parent) parent.trim();
  let root_category = "/".trim();
  let current_category;
  if (!parent) {
    parent = root_category;
    current_category = parent.concat(name);
  } else {
    current_category = parent.concat(root_category).concat(name);
  }
  CategoryModal.create(
    {
      name,
      parent,
      category: current_category,
    },
    (error, doc) => {
      if (error) return next(new ErrorHandler(error.message, 400));
      return res.status(200).json({ data: doc });
    }
  );
});

module.exports = CreateCategory;
