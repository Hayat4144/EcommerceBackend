const ProductVarient_Model = require("../..//model/Product_Varient");
const ErrorHandler = require("../../../../utils/ErrorHandler");
const AsyncFunc = require("../../../../utils/AsyncFunc");

exports.CreateProductVarient = AsyncFunc(async (req, res, next) => {
  const { VarientData } = req.body;
  const CreateVarientPromisse = VarientData.map((varient) => {
    return new Promise((resolve, reject) => {
      ProductVarient_Model.create(
        { ...varient, seller: req.user_id },
        (error, doc) => {
          error ? reject(error) : resolve(doc);
        }
      );
    });
  });

  Promise.all(CreateVarientPromisse)
    .then((createdVarients) => {
      if (createdVarients)
        return res.status(200).json({ data: createdVarients });
    })
    .catch((error) => {
      return next(new ErrorHandler(error.message, 400));
    });
});
