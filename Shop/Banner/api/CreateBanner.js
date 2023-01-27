const AsyncFunc = require('../../../utils/AsyncFunc');
const BannerModel = require('../Model/BannerModel');
const cloudinary = require('cloudinary').v2;
const ErrorHandler = require('../../../utils/ErrorHandler')
const fs = require('fs')

exports.CreateBanner = AsyncFunc(async (req, res, next) => {
    const { name, category, navigate_url } = req.body;
    cloudinary.uploader.upload(req.file.path, {unique_filename: true, folder: 'Banner' }, (error, data) => {
        fs.unlink(req.file.path, (err) => {
            if (err) throw err;
        });
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
