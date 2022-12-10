const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema({
	user: {
		type: mongoose.SchemaTypes.ObjectId,
		required: true,
		unique: true,
		ref: 'seller'
	},
	Street: {
		type: String,
		required: true,
		max: 50,
	},
	Area: {
		type: String,
		required: true,
		max: 50
	},
	city: {
		type: String,
		required: true,
		max: 20
	},
	State: {
		type: String,
		required: true,
		max: 30
	},
	pincode: {
		type: Number,
		required: true,
		min: 6,

	},
	Country: {
		type: String,
		required: true,
		max: 20,
		min: 4
	}

},
	{
		timestamps: {
			createdAt: 'created_at', // Use `created_at` to store the created date
			updatedAt: 'updated_at' // and `updated_at` to store the last updated date
		}
	}
)


const AddressSellerModel = mongoose.model('selleraddress', AddressSchema)

module.exports = AddressSellerModel;
