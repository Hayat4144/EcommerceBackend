const AsyncFunc = require("../../../utils/AsyncFunc");
const ErrorHandler = require("../../../utils/ErrorHandler");
const RatingModel = require("../model/RatingModel");

exports.CreateRatings = AsyncFunc(async (req, res, next) => {
    const { product, comment, rating } = req.body;
    RatingModel.create({
        user: req.user_id,
        product: product,
        comment

    }, (error, data) => {
        data.ratings = rating
        data.markModified('ratings')
        data.save()
        if (!error) return res.status(200).json({ data });
        next(new ErrorHandler(error.message, 400))


        // console.log(doc.ratings_review.get('ratings', null, { getters: true }))
        // return error ? res.status(400).json(error) : res.json(doc)
    })

})

exports.ReadRatings = AsyncFunc(async (req, res, next) => {
    // const id = "63a701ef8371580040ed16d4";
    // // increment a particular star level.
    // // by assigning directly to the ratings object
    // let prod = await RatingModel.findById(id)
    // console.log(prod.ratings)
    // prod.ratings = 3
    // prod.markModified('ratings')  // Add markModified because ratings is a mixed object type
    // prod.save()
    // console.log(prod.get('ratings', null, { getters: false }))
    // console.log(prod)
    return await RatingModel.find({}).then(doc => res.json(doc))
        .catch(err => res.status(400).json(err))
})