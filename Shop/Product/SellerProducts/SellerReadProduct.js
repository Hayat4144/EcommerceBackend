const AsyncFunc = require("../../../utils/AsyncFunc");
const ErrorHandler = require("../../../utils/ErrorHandler");
const ProductModel = require("../model/Product_Model");

exports.SellerReadProduct = AsyncFunc(async (req, res, next) => {
    let { search, page } = req.query;
    const pagination = (resultPerPage) => {
        page = page || 1
        const skip = resultPerPage * (page - 1)
        return skip;
    }


    ProductModel.aggregate([
        {
            $search: {
                index: 'default',
                text: {
                    query: search,
                    path: 'name',
                    fuzzy: {
                        maxEdits: 2
                    }
                }
            }
        },
        {
            $match: { seller: req.user_id }
        },
        {
            $facet: {
                result: [{ $skip: pagination(10) }, { $limit: 10 }],
                total_result: [
                    {
                        $count: 'count'
                    }
                ]
            }
        }
    ]).exec((err, doc) => {
        console.log(err, doc);
        if (err) return new ErrorHandler(err.message, 400);
        if (doc.length < 1) return res.status(404).json({ data: 'no product found' })
        return res.status(200).json({ data: doc[0] })
    })
})


exports.FetchSellerProduct = AsyncFunc(async (req, res, next) => {
    let { page } = req.query;
    const pagination = (resultPerPage) => {
        page = page || 1
        const skip = resultPerPage * (page - 1)
        return skip;
    }
    ProductModel.countDocuments({ seller: req.user_id }, (error, totalCount) => {
        if (error) return next(new ErrorHandler(error.message, 400));
        ProductModel.find({
            seller: req.user_id
        }).skip(pagination(10)).limit(10).exec((err, doc) => {
            if (err) return new ErrorHandler(err.message, 400);
            if (doc.length < 1) return res.status(404).json({ data: 'no product found' })
            return res.json({
                totalCount: totalCount,
                count: doc.length,
                data: doc
            });
        })
    })

})