const AsyncFunc = require('../../../utils/AsyncFunc');
const Product_model = require('../model/Product_Model')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const ErrorHandler = require('../../../utils/ErrorHandler')



exports.CreateProduct = AsyncFunc(async (req, res, next) => {
    const { name, description, cnt, price, varients, category, brand, attributes_name } = req.body;
    const image_files = req.files;
    const ImageUploadPromise = image_files.map(item => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(item.path, { unique_filename: true, folder: "Shop" }, (error, data) => {
                if (error) {
                    next(new ErrorHandler(error.message, 400))
                    return reject({ error })
                }
                else {
                    console.log(data.secure_url)
                    return resolve(data.secure_url)
                }
            })
        })

    })

    await Promise.all(ImageUploadPromise).then((data) => {
        let attributes = []
        attributes_name.forEach(element => {
            attributes.push({
                name: element
            })
        });
        Product_model.create({
            name,
            description,
            price,
            category,
            brand,
            assets: {
                images: data
            },
            varients: {
                cnt,
                attributes
            },
            seller: req.user_id
        }, (error, data) => {
            if (error) {
                next(new ErrorHandler(error.message, 400))
            } else {
                // console.log(data)
                console.log(data.get('ratings', null, { getters: true }))
                return res.status(200).json({ data })
            }
        })
    }).catch((error) => {
        res.status(400).json({ error })
    })






}) 
