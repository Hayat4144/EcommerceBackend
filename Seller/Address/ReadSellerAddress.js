const SellerAddressModel = require('../model/SellerAddressModel');
const AsyncFunc = require('../../utils/AsyncFunc');

exports.ReadSelerAddress = AsyncFunc(async (req, res, next) => {
    const IsDataExist = await SellerAddressModel.find({ user: req.user_id }).clone();
    if (IsDataExist.length === 0) {
        return res.status(400).json({error:"You have been not added any address yet."})

    }
    return res.status(200).json({ data: IsDataExist })
})	
