const AsyncFunc = require('../../../utils/AsyncFunc');
const ErrorHandler = require('../../../utils/ErrorHandler');
const category_model = require('../../Category/model/category_model');
const Product_Model = require('../model/Product_Model')

exports.Get_All_Product = async (req, res, next) => {
    try {
        let { search, sort, category, page ,rating} = req.query;
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
        console.log(SortIn)

        Product_Model.aggregate([
            {
                $search:
                {
                    index: 'default',
                    compound: {
                        must:[{
                            text:{
                                query:search,
                                path:"name",
                                fuzzy:{
                                    maxEdits:2
                                }
                            }
                        }],
                        // filter:{
                        //     range:{
                        //         gte:0,
                        //         lte:Number(rating),
                        //         path:"average_rating"
                        //     }
                        // }
                    }
                }
            },
            {$match:{price:Price}},
            {
                        $facet: {
                            result: [{ $skip: pagination(5) }, { $limit: 10 }, {$sort:SortIn}],
                            total_result: [
                                {
                                    $count: 'count'
                                }
                            ]
                        }
            }
        ], (error, data) => {
            if (error) return next(new ErrorHandler(error.message, 400))
            console.log(data[0].total_result.length)
            if (data[0].total_result.length === 0) {
                return next(new ErrorHandler('No product found', 404))
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
            if (data.length < 0) return next(new ErrorHandler('No product has been found.', 400))
            return res.status(200).json({ data })
        })
    })
}))











// {
//     "$search": {
//       "compound": {
//         "filter": [
//           {
//             "range": {
//               "gte": 4,
//               "path": "stars"
//             }
//           },
//           {
//             "text": {
//               "query": [
//                 "American",
//                 "Hamburgers",
//                 "Chinese"
//               ],
//               "path": "cuisine"
//             }
//           },
//           {
//             "text": {
//               "query": "Manhattan",
//               "path": "borough"
//             }
//           }
//         ],
//         "must": [
//           {
//             "text": {
//               "query": "Little Brown Jug",
//               "path": "name",
//               "fuzzy": {
//                 "maxEdits": 2
//               }
//             }
//           }
//         ],
//         "score": {
//           "function": {
//             "multiply": [
//               {
//                 "score": "relevance"
//               },
//               {
//                 "path": {
//                   "value": "stars",
//                   "undefined": 1
//                 }
//               },
//               {
//                 "path": {
//                   "value": "sponsored",
//                   "undefined": 1
//                 }
//               }
//             ]
//           }
//         }
//       }
//     }
//   }
  
//   {
//     "$limit": 21
//   }
  
//   {
//     "$project": {
//       "name": 1,
//       "cuisine": 1,
//       "borough": 1,
//       "location": 1,
//       "menu": 1,
//       "restaurant_id": 1,
//       "address.street": 1,
//       "stars": 1,
//       "review_count": 1,
//       "PriceRange": 1,
//       "sponsored": 1,
//       "score": {
//         "$meta": "searchScore"
//       },
//       "highlights": {
//         "$meta": "searchHighlights"
//       }
//     }
//   }