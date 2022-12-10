const mongoose = require('mongoose')
require('mongoose-type-url')
const ProfileImageSchema = new mongoose.Schema({
    seller: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'seller',
        unique: true,
        required: true

    },
    profile_image: {
        type: mongoose.SchemaTypes.Url,
        required: true,
        unique: true
    }
}, {
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
})

const SellerProfileImageModel = new mongoose.model('sellerprofileimage', ProfileImageSchema)

module.exports = SellerProfileImageModel;