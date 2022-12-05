const mongoose = require('mongoose')
require('mongoose-type-url')

const SellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        max: 20,
        min: 4
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    store_name: {
        type: String,
        required: true,
        trim: true,
        max: 20,
        min: 4
    },
    password: {
        type: String,
        required: true,
        max: 20,
        min: 8
    },
    is_varified: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    })

const SellerModel = new mongoose.model('seller', SellerSchema)

module.exports = SellerModel;