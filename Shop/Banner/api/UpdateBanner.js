const AsyncFunc = require('../../../utils/AsyncFunc')
const ErrorHandler = require('../../../utils/ErrorHandler')
const BannerModel = require('../Model/BannerModel')

exports.UpdateBanner = AsyncFunc(async (req, res, next) => {
    BannerModel.findByIdAndUpdate(req.body.banner_id, req.body, (error, data) => {
        if (error) {
            return next(new ErrorHandler(error, 400))
        }
        else {
            if (data === null) {
                return res.status(400).json({ error: "Sorry, Banner not found" })
            }
            else {
                return res.status(200).json({ data: "Banner has been updated Successfully." })
            }

        }
    })
})