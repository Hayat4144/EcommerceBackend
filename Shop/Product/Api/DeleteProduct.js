const AsyncFunc = require('../../../utils/AsyncFunc');
const ErrorHandler = require('../../../utils/ErrorHandler');
const Product_Model = require('../model/Product_Model')
const cloudinary = require('cloudinary').v2;

exports.DeleteProduct = AsyncFunc(async (req, res, next) => {
    const { product_id } = req.query;
    if (!product_id) return next(new ErrorHandler('product id is missing.', 400))
    const isProductExist = await Product_Model.findById(product_id);
    if (!isProductExist) return new ErrorHandler('No product found', 400);

    function DeleteProduct() {
        Product_Model.findByIdAndDelete(isProductExist._id)
            .exec((error, docs) => {
                if (error) {
                    return res.status(400).json({ "error": error.message })
                }
                else {
                    if (docs === null) {
                        return res.status(400).json({ error: `The product you trying to delete does not exist.` })
                    }
                    return res.status(200).json({ data: `The ${docs.name.length > 20 ? `${docs.name.substring(0, 20)}...` : docs.name} is deleted successuflly.` })
                }
            })
    }

    console.log(isProductExist.assets.images[0].url);
    if (!isProductExist.assets.images[0].url) {
        console.log('hello')
        return DeleteProduct();
    }

    function DeleteImage(image) {
        return cloudinary.uploader.destroy(image.publicId)
    }

    const DeletedImage = Promise.all(isProductExist.assets.images.map(images => DeleteImage(images)));
    DeletedImage.then((data) => {
        DeleteProduct();
    }).catch((error) => {
        return res.status(400).json({ error: error.message })
    })




})