const ProductVarient_Model = require("../..//model/Product_Varient");
const ErrorHandler = require("../../../../utils/ErrorHandler");
const AsyncFunc = require("../../../../utils/AsyncFunc");
const cloudinary = require('cloudinary').v2

exports.CreateProductVarient = AsyncFunc(async (req, res, next) => {
    const { productId, sizes, colors, stocks, prices } = req.body;
    const ProductVarientPromise = sizes.map((size => {
        return new Promise((resolve, reject) => {
            let id = 0;
            colors.map((color) => {
                const varient = new ProductVarient_Model({
                    product: productId,
                    stock: stocks[id],
                    price: prices[id],
                    seller: req.user_id,
                    product_attribute: { size: size, color: color },
                })
                varient.save((error, data) => {
                    if (error) {
                        console.log(error)
                        reject({ error })
                    }
                    else {
                        console.log(data)
                        resolve()
                    }
                })
                id++;
                console.log(id)
            })
        })
    }));

    await Promise.all(ProductVarientPromise)
        .then((data) => {
            return res.status(200).json({ data: "Product varients has been created successfull." })
        })
        .catch((error) => {
            next(new ErrorHandler(error, 400))
        })


});

