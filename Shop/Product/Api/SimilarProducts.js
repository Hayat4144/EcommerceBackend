const AsyncFunc = require("../../../utils/AsyncFunc");
const ErrorHandler = require("../../../utils/ErrorHandler");
const ProductModel = require("../model/Product_Model");
const mongoose = require("mongoose");

exports.SimilarProducts = AsyncFunc(async (req, res, next) => {
  const { search, productId, category } = req.query;
  ProductModel.aggregate(
    [
      {
        $search: {
          text: {
            query: search,
            path: "name",
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      },
      {
        $match: {
          category: {
            $regex: new RegExp(`^${category}`),
            $options: "i",
          },
          _id: { $ne: mongoose.Types.ObjectId(productId) },
        },
      },
      {
        $facet: {
          result: [{ $limit: 30 }],
          totalResult: [
            {
              $count: "count",
            },
          ],
        },
      },
    ],
    (error, data) => {
      if (error) return next(new ErrorHandler(error, 400));
      if(data[0].result.length < 1) return res.status(400).json({error:"No similar product has been found."})
      return res.status(200).json({ data :data[0]});
    }
  );
});

