const mongoose = require('mongoose');

const EmailTokenShema = new mongoose.Schema({
    seller: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'seller',
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true,
        uniqued: true
    }
},
    {
        timestamps: {
            createdAt: 'created_at', // Use `created_at` to store the created date
            updatedAt: 'updated_at' // and `updated_at` to store the last updated date
        }
    }
)

const EmailTokenModel = new mongoose.model('Token', EmailTokenShema)

module.exports = EmailTokenModel;