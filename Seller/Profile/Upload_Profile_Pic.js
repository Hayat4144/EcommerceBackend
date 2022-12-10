const ErrorHandler = require('../../utils/ErrorHandler')
const AsyncFunc = require('../../utils/AsyncFunc')
const cloudinary = require('cloudinary').v2;
const SellerProfileImageModel = require('../model/ProfileImageModel');

exports.SellerProfileImage = AsyncFunc(async (req, res, next) => {
    var buf = req.file.buffer.toString('base64');
    const IsProfileExist = await SellerProfileImageModel.find({ selelr: req.user_id })
    if (IsProfileExist.length !== 0) {
        const DeleteProfile = await SellerProfileImageModel.findOneAndDelete({ seller: req.user_id })
        await cloudinary.uploader.upload("data:image/png;base64," + buf, { folder: "Quote/PostImage" }, (err, result) => {
            if (!err) {
                SellerProfileImageModel.create({
                    seller: req.user_id,
                    profile_image: result.secure_url
                }, (err, doc) => {
                    console.log(err)
                    console.log(doc)
                    if (err) {
                        if (err.code === 11000) {
                            next(new ErrorHandler('You have already upload your profile pic.', 400))
                        }
                        else {
                            next(new ErrorHandler(err, 400));
                        }

                    } else {
                        return res.status(200).json({ data: "Your profile is uploaded successfully." });
                    }
                })
            }
        })

    }



    await cloudinary.uploader.upload("data:image/png;base64," + buf, { folder: "Quote/PostImage" }, (err, result) => {
        if (!err) {
            SellerProfileImageModel.create({
                seller: req.user_id,
                profile_image: result.secure_url
            }, (err, doc) => {
                console.log(err)
                console.log(doc)
                if (err) {
                    if (err.code === 11000) {
                        next(new ErrorHandler('You have already upload your profile pic.', 400))
                    }
                    else {
                        next(new ErrorHandler(err, 400));
                    }

                } else {
                    return res.status(200).json({ data: "Your profile is uploaded successfully." });
                }
            })
        }
    })


})