const AsyncFunc = require('../../../utils/AsyncFunc');
const BannerModel = require('../Model/BannerModel');
const cloudinary = require('cloudinary').v2;
const ErrorHandler = require('../../../utils/ErrorHandler')

exports.CreateBanner = AsyncFunc(async (req, res, next) => {
    const { name, category, navigate_url } = req.body;
    cloudinary.uploader.upload(req.file.path, { folder: 'Banner' }, (error, data) => {
        if (!error) {
            BannerModel.create({
                name,
                category,
                navigate_url,
                image: data.secure_url
            }, (err, doc) => {
                if (!err) {
                    return res.status(200).json({ data: doc })
                }
                next(new ErrorHandler(err.message, 200))
            })
        }
        else {
            next(new ErrorHandler(error, 400))
        }
    })
})
