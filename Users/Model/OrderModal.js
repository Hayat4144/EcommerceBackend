const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: [true, 'Please provide user id.'],
    },
    products: [
        {
            varientId: {
                type: mongoose.Types.ObjectId,
                required: [true, "please provide varient id"],
                ref: 'product_varients',
            },
            quantity: {
                type: Number,
                required: [true, "please provide quantity"],
            },
            price: {
                type: Number,
                required: [true, 'price can not be empty.']
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: [true, 'Total Price can not be empty.'],
    },
    status: {
        type: String,
        enum: ['created', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'created'
    },
    date: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
)

const OrderModal = new mongoose.model('OrderModal', OrderSchema)

module.exports = OrderModal;