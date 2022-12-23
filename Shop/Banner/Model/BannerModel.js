const mongoose = require('mongoose')

const BannerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Category',
        required: true,
    },
    navigate_url: {
        type: String,
        required: true
    }
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }

)

const BannerModel = new mongoose.model('banner', BannerSchema)

module.exports = BannerModel;