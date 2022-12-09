const mongoose = require('mongoose');


const UserPasswordTokenSchema = new mongoose.Schema({
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



const UserPasswordTokenModel = new mongoose.model('UserPasswordToken', UserPasswordTokenSchema)

module.exports = UserPasswordTokenModel;