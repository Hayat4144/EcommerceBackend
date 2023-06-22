const AsyncFunc = require("../../../utils/AsyncFunc");
const ErrorHandler = require("../../../utils/ErrorHandler");
const logger = require("../../../utils/Logger");
const category_model = require("../../Category/model/category_model");
const Product_Model = require("../model/Product_Model");

exports.Get_All_Product = async (req, res, next) => {
  try {
    let { search, sort, category, page, Star } = req.query;
    if (req.query.price) {
      var Price = JSON.stringify(req.query.price);
      Price = Price.replace(/\b(gt|lt|gte|lte)\b/g, (key, value) => `$${key}`);
      Price = JSON.parse(Price);
      for (let [key, value] of Object.entries(Price)) {
        Price[key] = Number(value);
      }
    }

    const pagination = (resultPerPage) => {
      page = page || 1;
      const skip = resultPerPage * (page - 1);
      return skip;
    };

    if (req.query.sort) {
      var SortIn = {};
      sort = sort.split(",");
      if (req.query.orderby === "desc") {
        sort.forEach((key) => {
          SortIn[key] = -1;
        });
      } else {
        sort.forEach((key) => {
          SortIn[key] = 1;
        });
      }
    }

    // text search
    const TextSearch = () => {
      Product_Model.aggregate(
        [
          {
            $search: {
              index: "default",
              compound: {
                must: [
                  {
                    text: {
                      query: search,
                      path: "name",
                      fuzzy: {
                        maxEdits: 2,
                      },
                    },
                  },
                ],
                filter: {
                  range: {
                    gte: Number(Star),
                    lte: 5,
                    path: "average_rating",
                  },
                },
              },
            },
          },
          { $match: { price: Price } },
          {
            $facet: {
              result: [
                { $skip: pagination(20) },
                { $limit: 10 },
                { $sort: SortIn },
              ],
              total_result: [
                {
                  $count: "count",
                },
              ],
            },
          },
        ],
        (error, data) => {
          if (error) return next(new ErrorHandler(error.message, 400));
          if (data[0].total_result.length === 0) {
            return res.status(400).json({ error: "No Product found." });
          } else {
            return res.status(200).json({ data });
          }
        }
      );
    };

    // category search
    const CategorySeach = async () => {
      const categoryRegex = new RegExp(`^${category}`, "gi");

      const getCategoryPaths = async () => {
        const categories = await category_model
          .find({
            $or: [{ parent: categoryRegex }, { category: categoryRegex }],
          })
          .select("category");
        const path = categories.map((cat) => cat.category);
        return path;
      };

      const getProductsWithCategoryPath = async (categoryPaths) => {
        const products = await Product_Model.find({
          category: { $in: categoryPaths },
          average_rating: { $gte: Number(Star), $lte: 5 },
          price: Price,
        })
          .sort(SortIn)
          .skip(pagination(20))
          .limit(10);
        return products;
      };

      const getTotalCount = async (categoryPaths) => {
        const count = await Product_Model.countDocuments({
          category: { $in: categoryPaths },
          average_rating: { $gte: Number(Star), $lte: 5 },
        });
        return count;
      };

      const categoryPaths = await getCategoryPaths();
      const categoryProducts = await getProductsWithCategoryPath(categoryPaths);
      const totalCount = await getTotalCount(categoryPaths);

      const response = [
        {
          result: categoryProducts,
          total_result: [
            {
              count: totalCount,
            },
          ],
        },
      ];
      if (totalCount === 0)
        return res.status(400).json({ error: "No product has been found" });
      return res.status(200).json({ data: response });
    };

    if (category) {
      CategorySeach();
    } else {
      TextSearch();
    }
  } catch (error) {
    console.log(error);
  }
};

// this function not work properly
exports.GetProductBYCategory = AsyncFunc(async (req, res, next) => {
  const { category_id } = req.query;
  category_model.find(
    { $or: [{ catogry: category_id }, { parentId: category_id }] },
    (error, subcategories) => {
      if (error) return next(new ErrorHandler(error, 400));
      const subcategoryId = subcategories.map((subcategory) => subcategory._id);
      Product_Model.find(
        {
          $or: [
            { category: category_id },
            { category: { $in: subcategoryId } },
          ],
        },
        (error, data) => {
          if (error) return next(new ErrorHandler(error, 400));
          if (data.length < 0)
            return next(new ErrorHandler("No product has been found.", 400));
          return res.status(200).json({ data });
        }
      );
    }
  );
});

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
