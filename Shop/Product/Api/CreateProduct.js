const AsyncFunc = require('../../../utils/AsyncFunc');
const Product_model = require('../model/Product_Model')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const ErrorHandler = require('../../../utils/ErrorHandler')
const fs = require('fs')
const sharp = require('sharp')



exports.CreateProduct = AsyncFunc(async (req, res, next) => {
    let { name, description, price, category, brand, attributes_name, stock } = req.body;
    const image_files = req.files;
    attributes_name = JSON.parse(attributes_name)
    price = parseInt(price)
    stock = parseInt(stock)
    const uploadImage = (item) => {
        return new Promise(async (resolve, reject) => {

            const imageBuffer = Buffer.from(item.buffer);
            // Resize image to 800x600
            
            const resizedImageBuffer = await sharp(imageBuffer)
                .resize(800, 600)
                .toBuffer();

            // Compress image with quality set to 70
            const compressedImageBuffer = await sharp(resizedImageBuffer)
                .jpeg({ quality: 70 })
                .toBuffer();


            // Remove metadata from the image
            const strippedImageBuffer = await sharp(compressedImageBuffer)
                .withMetadata({ orientation: undefined })
                .toBuffer();
            const stream = cloudinary.uploader.upload_stream({ unique_filename: true, folder: "Shop", chunk_size: 6000000 }, (error, data) => {
                if (error) {
                    reject(error)
                } else {
                    resolve({ url: data.secure_url, publicId: data.public_id })
                }
            })
            streamifier.createReadStream(strippedImageBuffer).pipe(stream)
        })
    }

    const ImageUploadPromise = Promise.all(image_files.map(item => uploadImage(item)))

    ImageUploadPromise.then((data) => {
        console.log(data);
        let attributes = []
        attributes_name.forEach(element => {
            attributes.push({
                name: element
            })
        });
        let image_array = data;
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
