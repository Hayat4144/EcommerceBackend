const AyscnFun = require("../../../utils/AsyncFunc");
const ErrorHandler = require("../../../utils/ErrorHandler");
const BannerModel = require("../Model/BannerModel");

exports.ReadBanner = AyscnFun(async (req, res, next) => {
  BannerModel.find({}).exec((error, data) => {
    if (!error) {
      if (data.length === 0) {
        return res.status(400).json({ error: "Sorry,No Banner found." });
      }
      return res.status(200).json({ data });
    }
    return next(new ErrorHandler(error, 400));
  });
});
