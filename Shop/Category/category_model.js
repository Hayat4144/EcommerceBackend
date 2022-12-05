const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
	name:{
		type:String,
		required:false,
		max:20
	},
	slug:{
		type:String,
		required:true,
		unique:true

	},
	parentId:{
		type:String,
		required:false,
		
	},
	created_at:{
		type:Date,
		default: Date.now(),
	}


})

const category_model = new mongoose.model('Category', CategorySchema)

module.exports = category_model ;
