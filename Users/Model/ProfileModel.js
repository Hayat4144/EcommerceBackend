const mongoose = require('mongoose');
require('mongoose-type-url');


const ProfileSchema = mongoose.Schema({
	user:{
		type:mongoose.SchemaTypes.ObjectId,
		rquired:true,
		unique:true,
		ref:'user'
	},
	profile_image:{
		type:mongoose.SchemaTypes.Url,
		rquired:true,
		unique:true
	}
}, {
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
})

const UserProfileModel= mongoose.model('userprofile',ProfileSchema);

module.exports = UserProfileModel ;
