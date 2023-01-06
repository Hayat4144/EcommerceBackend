const AsyncFunc = require('../../../utils/AsyncFunc');
const ErrorHandler = require('../../../utils/ErrorHandler');
const category_model = require('../../Category/model/category_model');
const Product_Model = require('../model/Product_Model')

exports.Get_All_Product = async (req, res, next) => {
    try {
        let { search, sort, category, page } = req.query;
        console.log(search)
        console.log(page)
        if (req.query.price) {
            var Price = JSON.stringify(req.query.price);
            Price = Price.replace(/\b(gt|lt|gte|lte)\b/g, (key, value) => `$${key}`)
            Price = JSON.parse(Price)
            for (let [key, value] of Object.entries(Price)) {
                Price[key] = Number(value)
            }
        }

        const pagination = (resultPerPage) => {
            page = page || 1
            const skip = resultPerPage * (page - 1)
            return skip;
        }


        if (req.query.sort) {
            var SortIn = {};
            sort = sort.split(',')
            if (req.query.orderby === 'desc') {
                sort.forEach(key => {
                    SortIn[key] = -1
                });
            }
            else {
                sort.forEach(key => {
                    SortIn[key] = 1
                });
            }
        }
        // await Product_Model.find(search)
        //     .skip(pagination(5))
        //     .limit(5)
        //     .sort(SortIn)
        //     .exec((error, doc) => {
        //         console.log(error)
        //         return error ? res.status(400).json({ error }) : res.status(200).json({ doc })
        //     })
        console.log(Price)
        Product_Model.aggregate([
            {
                $match: { name: { $regex: search, $options: 'i' } }
            },
            { $match: { price: Price } },
            {
                $facet: {
                    result: [{ $skip: pagination(5) }, { $limit: 10 }],
                    total_result: [
                        {
                            $count: 'count'
                        }
                    ]
                }
            }
        ], (error, data) => {
            if (error) next(new ErrorHandler(error.message, 400))
            console.log(data[0].total_result.length)
            if (data[0].total_result.length === 0) {
                next(new ErrorHandler('No product found', 404))
            }
            else {
                return res.status(200).json({ data })
            }
        })

    } catch (error) {
        console.log(error)
    }
}

exports.GetProductBYCategory = (AsyncFunc(async (req, res, next) => {
    const { category_id } = req.query;
    category_model.find({ $or: [{ _id: category_id }, { parentId: category_id }] }, (error, subcategories) => {
        if (error) return next(new ErrorHandler(error, 400))
        const subcategoryId = subcategories.map(subcategory => subcategory._id)
        Product_Model.find({
            $or: [
                { category: category_id },
                { category: { $in: subcategoryId } }
            ]
        }, (error, data) => {
            if (error) return next(new ErrorHandler(error, 400));
            return res.status(200).json({ data })
        })
    })
}))