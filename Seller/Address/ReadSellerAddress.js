const SellerAddressModel = require('../model/SellerAddressModel');
const ErrorHandler = require('../../utils/ErrorHandler');
const AsyncFunc = require('../../utils/AsyncFunc');
const SellerModel = require('../model/SellerModel');

exports.ReadSelerAddress = AsyncFunc(async (req, res, next) => {
    const IsDataExist = await SellerAddressModel.find({ user: req.user_id }).clone();
    if (IsDataExist.length === 0) {
        return next(new ErrorHandler('You have not been added any address.', 400))

    }
    return res.status(200).json({ data: IsDataExist })
})	
