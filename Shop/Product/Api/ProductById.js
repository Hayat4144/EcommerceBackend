const AsyncFunc = require("../../../utils/AsyncFunc");
const ErrorHandler = require("../../../utils/ErrorHandler");
const ProductModel = require("../model/Product_Model");
const ProductVarient_Model = require("../model/Product_Varient");

exports.FetchProductById = AsyncFunc(async (req, res, next) => {
  const { id } = req.params;
  const Products = await ProductModel.findById(id);
  if (!Products)
    return res.status(400).json({ error: "Product has been not found." });
  const Varients = await ProductVarient_Model.find({ productid: id });
  return res.status(200).json({ Products, Varients });
});
