const AsyncFunc = require("../../../utils/AsyncFunc");
const ErrorHandler = require("../../../utils/ErrorHandler");
const ProductModel = require("../model/Product_Model");
const cloudinary = require("cloudinary").v2;

const deleteImage = async (image) => {
  return cloudinary.uploader.destroy(image.publicId);
};

const DbProductDelete = async (product_id) => {
  try {
    const dlProduct = await ProductModel.findByIdAndDelete(product_id);
    return dlProduct;
  } catch (error) {
    return error;
  }
};

const DeleteProduct = AsyncFunc(async (req, res, next) => {
  const { product_id } = req.query;
  const isProductExist = await ProductModel.findById(product_id);
  if (!isProductExist)
    return res.status(400).json({ error: "Product has been not found." });

  const DeleteImagePromise = Promise.all(
    isProductExist.assets.images.map((images) => deleteImage(images))
  );

  DeleteImagePromise.then(async (data) => {
    console.log(data);
    const deletedProduct = await DbProductDelete(product_id);
    if (deletedProduct)
      return res
        .status(200)
        .json({ data: "Product has been deleted successfully." });
  }).catch((error) => {
    return next(new ErrorHandler(error.message, 400));
  });
});

module.exports = DeleteProduct;
