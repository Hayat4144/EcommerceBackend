const AsyncFunc = require("../../../../utils/AsyncFunc");
const ErrorHandler = require("../../../../utils/ErrorHandler");
const ProductModel = require("../../model/Product_Model");
const RatingModel = require("../../model/RatingModel");

exports.ReadRatings = AsyncFunc(async (req, res, next) => {
  const { product_id } = req.query;
  ProductModel.findById(product_id).exec((error, doc) => {
    if (error) return next(new ErrorHandler(error, 400));
    if (doc.length < 1)
      return next(new ErrorHandler("Sorry,no review found.", 400));
    doc.populate(
      {
        path: "ratings_review.user",
        select: "firstName lastName",
      },
      (err, data) => {
        if (err) return next(new ErrorHandler(err, 400));
        if (data.length < 1)
          return next(new ErrorHandler("Sorry, no review found", 400));
        const { ratings_review } = data;
        return res.status(200).json({ data: ratings_review });
      }
    );
  });
});
