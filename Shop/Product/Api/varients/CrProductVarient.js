const ProductVarient_Model = require("../..//model/Product_Varient");
const ErrorHandler = require("../../../../utils/ErrorHandler");
const AsyncFunc = require("../../../../utils/AsyncFunc");
const cloudinary = require('cloudinary').v2
exports.CreateProductVarient = AsyncFunc(async (req, res, next) => {
    const Data = JSON.parse(req.body.data);
    const image_files = req.files;
    const ImageUploadPromise = image_files.map((item) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(item.path, { folder: 'Shop' }, (error, data) => {
                if (error) {
                    next(new ErrorHandler(error.message, 400))
                    return reject({ error })
                }
                else {
                    return resolve(data.secure_url)
                }
            })
        })
    })
    await Promise.all(ImageUploadPromise).then((data) => {
        ProductVarient_Model.create({
            stock: Data.stock,
            price: Data.price,
            product: Data.product,
            assets: {
                images: data
            },
            product_attribute: Data.attributes,
            seller: req.user_id
        }, (error, data) => {
            if (error) {
                next(new ErrorHandler(error.message, 400))
            } else {
                return res.status(200).json({ data })
            }
        })
    }).catch((error) => {
        res.status(400).json({ error })
    })
});
