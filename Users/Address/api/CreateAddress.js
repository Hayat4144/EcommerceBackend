const UserAddressModel = require('../../Model/AddressModel');
const ErrorHandler = require('../../../utils/ErrorHandler');
const AsyncFunc = require('../../../utils/AsyncFunc');
const UserModel = require('../../Model/UserModel');



exports.CreateUserAddress = AsyncFunc(async (req, res, next) => {
	const IsUserExist = await UserModel.findById(req.user_id);
	if (IsUserExist.length === 0) {
		next(new ErrorHandler('Sorry ,User does not exist', 400))
	}
	const UserAddress_object = {
		...req.body,
		user: req.user_id,
	}
	const IsUserAddress = await UserAddressModel.find({ user: req.user_id })
	if (IsUserAddress.length > 0) {
		UserAddressModel.findOneAndUpdate({ user: req.user_id }, { $set: req.body }, { new: true }, (error, doc) => {
			if (error) next(new ErrorHandler(error, 400))
			return res.status(200).json({ data: "Your address has been updated successfully.", doc });
		})
	}
	else {
		UserAddressModel.create(UserAddress_object, (err, doc) => {
			if (err) {
				if (err.code === 11000) {
					next(new ErrorHandler('You have already create your address.', 400))
				}
				else {
					next(new ErrorHandler(err, 400));
				}

			} else {
				return res.status(200).json({ data: "Your address has been created successfully.", doc });
			}
		})
	}

})
