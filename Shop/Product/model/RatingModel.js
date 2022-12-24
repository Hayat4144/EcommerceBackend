const mongoose = require('mongoose')

const getstar = (ratings) => {
    let items = Object.entries(ratings)
    let sum = 0; // sum of weighted ratings
    let total = 0; // total number of ratings
    for (let [key, value] of items) {
        total += value
        sum += value * key;
    }
    let average_rating = sum / total;
    console.log(average_rating)
    return (Math.round(average_rating * 100) / 100).toFixed(2)
}


const RatingSchema = new mongoose.Schema({
    product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product',
        required: [true, 'please provide product id']
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        requird: [true, 'Please provide user id'],
    },

    ratings: {
        type: mongoose.SchemaTypes.Mixed,
        1: Number, //  the key is the weight of that star level
        2: Number,
        3: Number,
        4: Number,
        5: Number,
        get: getstar,
        set: function (r) {
            if (!(this instanceof mongoose.Document)) {
                // only call setter when updating the whole path with an object
                if (r instanceof Object) return r
                else { throw new Error('') }
            } else {
                // get the actual ratings object without using the getter which returns  an integer value
                // r is the ratings which is an integer value that represent the star level from 1 to 5
                if (r instanceof Object) {
                    return r    // handle setting default when creating object
                }
                this.get('ratings', null, { getters: false })[r] = 1 + parseInt(this.get('ratings', null, { getters: false })[r])
                return this.get('ratings', null, { getters: false })
            } // return the updated ratings object
        },
        default: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },

    },
    comment: {
        type: String,
        max: 355
    },

    // { toObject: { getters: true, }, toJSON: { getters: true } }

}, { toObject: { getters: true, }, toJSON: { getters: true } })

const RatingModel = new mongoose.model('rating_review', RatingSchema)

module.exports = RatingModel;