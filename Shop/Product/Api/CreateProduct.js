const AsyncFunc = require('../../../utils/AsyncFunc');
const Product_model = require('../model/Product_Model')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const ErrorHandler = require('../../../utils/ErrorHandler')
const fs = require('fs')



exports.CreateProduct = AsyncFunc(async (req, res, next) => {
    let { name, description, price, category, brand, attributes_name, stock } = req.body;
    const image_files = req.files;
    attributes_name = JSON.parse(attributes_name)
    price = parseInt(price)
    stock = parseInt(stock)
    const ImageUploadPromise = image_files.map(item => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream({ unique_filename: true, folder: "Shop" }, (error, data) => {
                if (error) {
                    next(new ErrorHandler(error.message, 400))
                    return reject({ error })
                }
                else {
                    console.log(data.secure_url);
                    return resolve({ url: data.secure_url, publicId: data.public_id })
                }
            })
            streamifier.createReadStream(item.buffer).pipe(stream)

        })

    })

    await Promise.all(ImageUploadPromise).then((data) => {
        console.log(data);
        let attributes = []
        attributes_name.forEach(element => {
            attributes.push({
                name: element
            })
        });
        let image_array = [];
        data.map(images => {
            image_array.push(images)
        })
        Product_model.create({
            name,
            description,
            price,
            category,
            brand,
            stock,
            assets: {
                images: image_array
            },
            varients: {
                attributes
            },
            seller: req.user_id
        }, (error, data) => {
            if (error) return next(new ErrorHandler(error.message, 400));
            return res.status(200).json({ data: "Product has been added successfully." })
        })
    }).catch((error) => {
        res.status(400).json({ error })
    })
}) 
