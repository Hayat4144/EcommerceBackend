const ProductModel = require("../../model/Product_Model");
const AsyncFunc = require('../../../../utils/AsyncFunc')
const ErrorHandler = require('../../../../utils/ErrorHandler');

exports.CreateRatings = AsyncFunc(async (req, res, next) => {
    const { product_id, comment, Star } = req.body;
    const IsProdcutExist = await ProductModel.findById(product_id);
    if (IsProdcutExist === null) return next(new ErrorHandler('Product does not exist', 400));
    const alreadyRated = IsProdcutExist.ratings_review.find(item => item.user.toString() === req.user_id.toString());
    if (alreadyRated) {
        ProductModel.updateOne(
            {
                ratings_review: {
                    $elemMatch: alreadyRated
                }
            }, {
            $set: {
                "ratings_review.$.Star": Star,
                "ratings_review.$.comment": comment
            }
        }, { $new: true }, (error, data) => {
            if (error) return next(new ErrorHandler(error.message, 400))

        })
    }
    else {
        ProductModel.findByIdAndUpdate(product_id,
            {
                $push: {
                    ratings_review: {
                        user: req.user_id,
                        Star,
                        comment
                    }
                }
            }, { $new: true }, (error, data) => {
                if (error) return next(new ErrorHandler(error.messge, 400))
            })
    }
    const GetAllRatings = await ProductModel.findById(product_id)
    const total_ratings = GetAllRatings.ratings_review;
    let stars = []
    //  ------------------- push star value in stars array --------------------- //
    total_ratings.forEach(element => {
        stars.push(element.Star)
    });

     //  ------------------- calculate total stars  --------------------- //
    const TotalStars = stars.reduce((accum, current) => {
        return accum + current;
    }, 0)

     //  ------------------- avarating ratings  --------------------- //
    const average_rating = Math.round(TotalStars / stars.length)

     //  ------------------- update the ratings --------------------- //
    ProductModel.findByIdAndUpdate(product_id, { average_rating }, { $new: true }, (error, data) => {
        if (error) next(new ErrorHandler(error.message, 400))
        return res.status(200).json({ data: "Thank you for rating and review ." })
    })

})