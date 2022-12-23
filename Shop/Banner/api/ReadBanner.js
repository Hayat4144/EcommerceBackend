const AyscnFun = require('../../../utils/AsyncFunc')
const ErrorHandler = require('../../../utils/ErrorHandler')
const BannerModel = require('../Model/BannerModel')

exports.ReadBanner = AyscnFun(async (req, res, next) => {
    BannerModel.find({}).exec((error, data) => {
        if (!error) {
            if (data.length === 0) {
                next(new ErrorHandler('Sorry no Banner found', 400))
            }
            return res.status(200).json({ data })
        }
        next(new ErrorHandler(error, 400))
    })
})