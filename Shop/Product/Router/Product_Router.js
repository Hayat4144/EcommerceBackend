const express = require("express");
const { CreateProduct } = require("../Api/CreateProduct");
const DeleteProduct = require("../Api/DeleteProduct");
const {
  Get_All_Product,
  GetProductBYCategory,
} = require("../Api/Get_All_Product");
const { UpdateProduct } = require("../Api/UpdataProduct");
const SellerAuthMiddleware = require("../../../Middleware/SellerAuthMiddleware");
const UserAuthMiddleware = require("../../../Middleware/UserAuthMiddleware");
const { CreateProductVarient } = require("../Api/varients/CrProductVarient");
const {
  fetchProductVarient,
  FetchProductVarientById,
  SelllerVarients,
  SellerVarientsById,
} = require("../Api/varients/FetchProductVarients");
const { SimilarProducts } = require("../Api/SimilarProducts");
const { DeleteVarients } = require("../Api/varients/DltVarients");
const { UpdataVarients } = require("../Api/varients/UpdVarients");
const { FetchProductById } = require("../Api/ProductById");
const { CreateRatings } = require("../Api/Reviews/CreateRatings");
const { SampleProducts } = require("../Api/SampleProducts");
const { AllProducts } = require("../Api/AllProducts");
const { ReadRatings } = require("../Api/Reviews/Ratings");
const multer = require("multer");
const {
  ProductValidtion,
  ProductValidationError,
} = require("../Validation/CreateProductValidations");
const {
  SellerReadProduct,
  FetchSellerProduct,
} = require("../SellerProducts/SellerReadProduct");
const {
  ProductIdValidation,
  ProductIdError,
} = require("../Validation/ProductIdValidation");
const {
  VarientIdValidation,
  VrntValidationError,
} = require("../Validation/VarientIdValidation");
const {
  VarientValidation,
  VarientValidateError,
} = require("../Validation/VarientValidation");
const fileupload = multer();
const Product_router = express.Router();

// Product Routers

// 1. Create Product
Product_router.post(
  "/v4/api/create/product",
  SellerAuthMiddleware,
  fileupload.array("product_image", 4),
  ProductValidtion,
  ProductValidationError,
  CreateProduct
);

Product_router.get("/v4/api/product/:id", FetchProductById);

// 2. get all product
Product_router.get("/v4/api/get_all/product", Get_All_Product);

Product_router.get("/v4/api/getproduct_by_category", GetProductBYCategory);

Product_router.get(
  "/v4/api/seller/read/product",
  SellerAuthMiddleware,
  SellerReadProduct
);
Product_router.get(
  "/v4/api/seller/products",
  SellerAuthMiddleware,
  FetchSellerProduct
);

// 3 Delete product
Product_router.delete(
  "/v4/api/delete/product",
  SellerAuthMiddleware,
  ProductIdValidation,
  ProductIdError,
  DeleteProduct
);

// 4. Update Product
Product_router.put(
  "/v4/api/update/product",
  SellerAuthMiddleware,
  UpdateProduct
);

//  Product Varients
Product_router.get("/v3/api/product/varientById/:id", fetchProductVarient);

// 5. Create Product varient
Product_router.post(
  "/v4/api/create/product/varient",
  SellerAuthMiddleware,
  VarientValidation,
  VarientValidateError,
  CreateProductVarient
);

// 6. fetch seller prduct varient
Product_router.get(
  "/v4/api/get_all/product/varients",
  SellerAuthMiddleware,
  SelllerVarients
);

//  7 . fetch product by varient id or product id
Product_router.get(
  "/v4/api/seller/varient",
  SellerAuthMiddleware,
  VarientIdValidation,
  VrntValidationError,
  SellerVarientsById
);

//  8 delete product varient
Product_router.delete(
  "/v4/api/delete/product/varient",
  SellerAuthMiddleware,
  VarientIdValidation,
  VrntValidationError,
  DeleteVarients
);

// 9 update product varient
Product_router.put(
  "/v4/api/update/product/varient",
  SellerAuthMiddleware,
  VarientValidation,
  VarientValidateError,
  UpdataVarients
);

//  10 Product reviews
Product_router.post(
  "/v4/api/product/reviews",
  UserAuthMiddleware,
  CreateRatings
);

Product_router.get("/v4/api/get/similar/product", SimilarProducts);
Product_router.get("/v4/api/get/sample/product", SampleProducts);
Product_router.get("/v4/api/products", AllProducts);

Product_router.post(
  "/v4/api/get/products/varients/order/history",
  FetchProductVarientById
);

Product_router.get("/v4/api/products/ratings/review", ReadRatings);

module.exports = Product_router;
