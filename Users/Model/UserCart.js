const mongoose = require('mongoose')

const UserCartSchema = new mongoose.Schema({
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

const UserCartModel = new mongoose.model('user_cart', UserCartSchema)

module.exports = UserCartModel;