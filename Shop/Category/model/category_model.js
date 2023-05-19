const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: false,
		max: 50,
		unique:true
	},
	parent:{
		type:String,
		require:true,
	},
	category:{
		type:String,
		require:true,
	}
},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		}
	})

const category_model = new mongoose.model('Category', CategorySchema)

module.exports = category_model;
