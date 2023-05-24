const ProductVarient_Model = require("../../model/Product_Varient");
const ErrorHandler = require("../../../../utils/ErrorHandler");
const AsyncFunc = require("../../../../utils/AsyncFunc");

// fetch all Seller Varients
exports.SelllerVarients = AsyncFunc(async (req, res, next) => {
  const Varients = await ProductVarient_Model.find({ seller: req.user_id });
  if (Varients.length < 1)
    return res.status(400).json({ error: "No vairent has been found." });
  return res.status(200).json({ data: Varients });
});

// fetch seller varient by varient id
exports.SellerVarientsById = AsyncFunc(async (req, res, next) => {
  await ProductVarient_Model.find({
    seller: req.user_id,
    _id: req.query.varient_id,
  }).exec((error, doc) => {
    if (error) {
      return res.status(400).json({ error: error.message });
    } else {
      if (doc.length === 0) {
        return res.status(400).json({ error: "Sorry product does not exist" });
      }
      return res.status(200).json({ doc });
    }
  });
});

// fetch all the proudcts varient by product id
exports.fetchProductVarient = AsyncFunc(async (req, res, next) => {
  await ProductVarient_Model.find({ product: req.params.id }).exec(
    (error, data) => {
      if (error) {
        next(new ErrorHandler(error.message, 400));
      } else {
        console.log(data.length);
        if (data.length === 0) {
          return next(new ErrorHandler("No varient available", 400));
        } else {
          return res.status(200).json({ data: data });
        }
      }
    }
  );
});

// fetch varient for orders
exports.FetchProductVarientById = AsyncFunc(async (req, res, next) => {
  const { varients } = req.body;
  const IsVarientExist = varients.map((varientId) => {
    return new Promise((resolve, reject) => {
      ProductVarient_Model.findById(varientId).exec((error, doc) => {
        if (error) return reject(error);
        if (doc.length < 1) return reject("No proudct found");
        doc.populate("product", (err, data) => {
          if (err) return reject(err);
          resolve(data);
        });
      });
    });
  });

  await Promise.all(IsVarientExist)
    .then((varients) => {
      if (varients.length < 1)
        return next(new ErrorHandler("No Product found"));
      return res.status(200).json({ data: varients });
    })
    .catch((error) => {
      console.log("hello");
      return next(new ErrorHandler(error, 400));
    });
});
