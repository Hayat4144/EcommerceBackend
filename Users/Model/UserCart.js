const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: [true, 'Please provide user id.'],
        unique: [true, 'user shoud be unique.']
    }
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
)

const CartModel = new mongoose.model('cart', CartSchema)

module.exports = CartModel;