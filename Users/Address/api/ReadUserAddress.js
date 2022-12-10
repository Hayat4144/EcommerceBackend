const UserAddressModel = require('../../Model/AddressModel');
const ErrorHandler = require('../../../utils/ErrorHandler');
const AsyncFunc = require('../../../utils/AsyncFunc');
const UserModel = require('../../Model/UserModel');

exports.ReadUserAddress = AsyncFunc(async (req, res, next) => {
	const IsDataExist = await UserAddressModel.find({ user: req.user_id }).clone();
	if (IsDataExist.length === 0) {
		return next(new ErrorHandler('You have not been added any address.', 400))

	}
	return res.status(200).json({ data: IsDataExist })



})	
