const mongoose = require('mongoose')
const category_model = require('../../Category/model/category_model')
require('mongoose-type-url')
const seller = require('../../../Seller/model/SellerModel')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 20
    },
    description: {
        type: String,
        required: true,
        max: 100
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: mongoose.SchemaTypes.Url,
        required: true
    },
    category: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref:'Category'

    },
    brand: {
        type: String,
        max: 50,
        required: true
    },
    seller: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'seller',
        required: true
    }
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    })

const ProductModel = new mongoose.model('Product', ProductSchema)

module.exports = ProductModel;