const ErrorHandler = require('../../utils/ErrorHandler')
const AsyncFunc = require('../../utils/AsyncFunc')
const cloudinary = require('cloudinary').v2;
const SellerProfileImageModel = require('../model/ProfileImageModel');
const streamifier = require('streamifier')

exports.SellerProfileImage = AsyncFunc(async (req, res, next) => {
    const IsProfileExist = await SellerProfileImageModel.findOneAndDelete({ seller: req.user_id })
    console.log(IsProfileExist)
    let cloudinary_uplaod_stream = cloudinary.uploader.upload_stream({ folder: 'Seller/avtar' }, async (error, result) => {
        console.log(result)
        if (error) {
            next(new ErrorHandler(error.message, 400))
        }
        else {
            const create_profile = await SellerProfileImageModel.create({
                seller: req.user_id,
                profile_image: result.secure_url
            })
            return res.status(200).json({ data: "Your profile is uploaded successfully." });
        }
    })
    streamifier.createReadStream(req.file.buffer).pipe(cloudinary_uplaod_stream);

})