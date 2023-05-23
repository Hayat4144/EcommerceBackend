const ProductModel = require("../Shop/Product/model/Product_Model");

const IsProductExist = async (productId) => {
  try {
    const IsProduct = await ProductModel.findById(productId);
    return IsProduct;
  } catch (error) {
    return error;
  }
};

module.exports = IsProductExist;
