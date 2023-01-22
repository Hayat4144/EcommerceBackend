const mongoose = require('mongoose')
require('mongoose-type-url')

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        max: 20,
        min: 4
    },
    lastName:{
        type:String,
        trim:true,
        max:20,
        min:5
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        max: 20,
        min: 8
    },
    is_active: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    }
)


const UserModel = new mongoose.model('user', UserSchema)
module.exports = UserModel;