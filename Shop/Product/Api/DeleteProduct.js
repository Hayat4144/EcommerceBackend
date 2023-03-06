const AsyncFunc = require('../../../utils/AsyncFunc');
const ErrorHandler = require('../../../utils/ErrorHandler');
const Product_Model = require('../model/Product_Model')
const cloudinary = require('cloudinary').v2;

exports.DeleteProduct = AsyncFunc(async (req, res, next) => {
    const { product_id } = req.query;
    if (!product_id) return next(new ErrorHandler('product id is missing.', 400))
    const isProductExist = await Product_Model.findById(product_id);
    if (!isProductExist) return new ErrorHandler('No product found', 400);
    function DeleteProductdata() {
        Product_Model.findOneAndDelete({ _id: product_id, seller: req.user_id })
            .exec((error, docs) => {
                if (error) {
                    return res.status(400).json({ "error": error.message })
                }
                else {
                    if (docs === null) {
                        return res.status(400).json({ error: `The product you trying to delete does not exist.` })
                    }
                    return res.status(200).json({ data: `The ${docs.name} product is deleted successuflly.` })
                }
            })
    }
    if (isProductExist.assets.images.length < 1) return DeleteProductdata();
    const DeleteUploadedImages = isProductExist.assets.images.map(image => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(image.publicId, (error, result) => {
                console.log(error, result);
                if (error) return reject(error);
                resolve(result)
            })
        })
    })
    await Promise.all(DeleteUploadedImages).then(data => {
        console.log(data);
        DeleteProductdata();
    }).catch(error => {
        console.log('error', error)
        if (error) next(new ErrorHandler(error.message, 400))
    })

})