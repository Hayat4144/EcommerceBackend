
const mongoose = require('mongoose')
require('mongoose-type-url')

const ProductVarientSchema = new mongoose.Schema({
    product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product',
        required: true
    },
    stock: {
        type: Number,
        min: 10,
        max: 400,
        required: true
    },
    assets: {
        images: {
            type: Array,
            required: true
        }
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    seller: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'seller'
    },
    product_attribute: {
        type: Array,
        required: true
    }
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    }
)

const ProductVarient_Model = new mongoose.model('product_varients', ProductVarientSchema)
module.exports = ProductVarient_Model