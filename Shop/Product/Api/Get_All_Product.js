const Product_Model = require('../model/Product_Model')

exports.Get_All_Product = async (req, res) => {
    try {
        let { search, sort, category, page } = req.query;
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

        const t = { price: { $gt: 34, $lt: 45 } }
        console.log(Price)
        const data = await Product_Model.aggregate([
            {
                $match: {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
                }
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
        ])
        return res.status(200).json({ data })
    } catch (error) {
        console.log(error)
    }
}