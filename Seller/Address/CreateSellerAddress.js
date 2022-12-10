const SellerAddressModel = require('../model/SellerAddressModel');
const ErrorHandler = require('../../utils/ErrorHandler');
const AsyncFunc = require('../../utils/AsyncFunc');
const SellerModel = require('../model/SellerModel');



exports.CreateSellerAddress = AsyncFunc(async (req, res, next) => {
    const IsUserExist = await SellerModel.findById(req.user_id);
    if (IsUserExist.length === 0) {
        next(new ErrorHandler('Sorry ,User does not exist', 400))
    }
    const SellerAddress_object = {
        ...req.body,
        user: req.user_id,
    }
    SellerAddressModel.create(SellerAddress_object, (err, doc) => {
        if (err) {
            if (err.code === 11000) {
                next(new ErrorHandler('You have already create your address.', 400))
            }
            else {
                next(new ErrorHandler(err, 400));
            }

        } else {
            return res.status(200).json({ doc });
        }
    })
})
