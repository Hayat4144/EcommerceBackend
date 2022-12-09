const mongoose = require('mongoose');


const UserEmailTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true,
        unique: true

    },
    token: {
        type: String,
    }

},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
)



const UserEmailTokenModel = new mongoose.model('UserEmailToken', UserEmailTokenSchema)

module.exports = UserEmailTokenModel;