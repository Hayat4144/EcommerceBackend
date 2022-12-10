const UserAddressModel = require('../../Model/AddressModel')
const ErrorHandler = require('../../../utils/ErrorHandler')
const AsynFunc = require('../../../utils/AsyncFunc');

exports.UpdateUserAddress = AsynFunc(async (req, res, next) => {
	UserAddressModel.findByIdAndUpdate(req.body._id, { $set: req.body }, (error, data) => {
		if (error) {
			return next(new ErrorHandler(error, 400))
		}
		else {
			if (data === null) {
				next(new ErrorHandler('Sorry , Data not found', 400))
			}
			else {
				return res.status(200).json({ data: "Your address is changed Successfully." })
			}

		}
	})

})
