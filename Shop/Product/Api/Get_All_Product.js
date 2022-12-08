const Product_Model = require('../model/Product_Model')

exports.Get_All_Product = async (req, res) => {
    try {
        let { search, sort, category, page } = req.query;
        if (req.query.price) {
            var Price = JSON.stringify(req.query.price);
            Price = Price.replace(/\b(gt|lt|gte|lte)\b/g, key => `$${key}`)
            Price = JSON.parse(Price)
        }

        if (search) {
            search = {
                seller: req.user_id,
                name: { $regex: search, $options: 'i' },

            }
        }
        else {

            search = {
                // seller: req.user_id,
                // price: Price
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
        await Product_Model.find(search)
            .skip(pagination(5))
            .limit(5)
            .sort(SortIn)
            .populate({
                path: 'category',
                match: { name: { $regex: req.query.category, $options: 'i' } }
            })
            .exec((error, doc) => {
                return error ? res.status(400).json({ error }) : res.status(200).json({ doc })
            })
    } catch (error) {
        console.log(error)
    }
}