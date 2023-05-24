const ProductVarient_Model = require("../../model/Product_Varient");
const ErrorHandler = require("../../../../utils/ErrorHandler");
const logger = require("../../../../utils/Logger");

exports.UpdataVarients = async (req, res, next) => {
  try {
    await ProductVarient_Model.findOneAndUpdate(
      { _id: req.body.varient_id, seller: req.user_id },
      { $set: req.body.VarientData },
      { new: true }
    ).exec((error, doc) => {
      if (error) {
        logger.error(error);
        return res.status(400).json({ error: error.message });
      } else {
        if (doc === null) {
          return res.status(400).json({
            error: `The varient you trying to update does not exist.`,
          });
        }
        return res.status(200).json({
          data: `Varient has been updated successuflly.`,
        });
      }
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};
