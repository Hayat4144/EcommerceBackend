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
    assets: {
        images: {
            type: Array,
            required: true
        }
    }
    ,
    category: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Category'

    },
    varients: {
        cnt: {
            type: Number,
            max: 40
        },
        attributes: [
            {
                name: {
                    type: String,
                    max: 20,
                    min: 2
                }

            }
        ]
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
    },
    ratings: {
        type: mongoose.SchemaTypes.Mixed,
        1: Number,
        2: Number,
        3: Number,
        4: Number,
        5: Number,
        get: function (r) {
            console.log(r)
        },
        set: function (r) {
            console.log(r)
        },
        default: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 }
    }

},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    },
    // {
    //     toObject: { getters: true },
    //     toJSON: { getters: true }
    // }
)

// create index 
ProductSchema.index({ name: 1, description: 1 })

const ProductModel = new mongoose.model('Product', ProductSchema)

module.exports = ProductModel;