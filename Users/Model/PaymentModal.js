const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Order is required.'],
        ref: 'OrderModal'
    },
    method: {
        type: String,
        enum: ['Cash on Delivery', 'ATM Card', 'UPI', 'Online Banking'],
        default: 'Cash on Delivery'
    },
    details: {
        type: Map,
        of: String,
    },
    transaction_id: String,
    date: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    }
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
)

const PaymentModal = new mongoose.Model('order_payment', PaymentSchema)

module.exports = PaymentModal;