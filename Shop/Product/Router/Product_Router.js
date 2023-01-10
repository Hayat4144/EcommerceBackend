const express = require('express');
const { CreateProduct } = require('../Api/CreateProduct');
const { DeleteProduct } = require('../Api/DeleteProduct');
const { Get_All_Product, GetProductBYCategory } = require('../Api/Get_All_Product');
const { UpdateProduct } = require('../Api/UpdataProduct');
const SellerAuthMiddleware = require('../../../Middleware/SellerAuthMiddleware');
const UserAuthMiddleware = require('../../../Middleware/UserAuthMiddleware');
const { CreateProductVarient } = require('../Api/varients/CrProductVarient');
const { Get_All_ProductVarients, fetch_Product_By_Id_Or_ProductId, fetchProductVarient } = require('../Api/varients/FetchProductVarients');
const { SimilarProducts } = require('../Api/SimilarProducts');
const { DeleteVarients } = require('../Api/varients/DltVarients');
const { UpdataVarients } = require('../Api/varients/UpdVarients');
const upload = require('../../../utils/upload');
const { FetchProductById } = require('../Api/ProductById');
const { CreateRatings } = require('../Api/Ratings/CreateRatings');

const Product_router = express.Router();


// Product Routers

// 1. Create Product 
Product_router.post('/v4/api/create/product', upload.array('product_image', 4), SellerAuthMiddleware, CreateProduct)

Product_router.get('/v4/api/product/:id', FetchProductById)

// 2. get all product 
Product_router.get('/v4/api/get_all/product', Get_All_Product)

Product_router.get('/v4/api/getproduct_by_category', GetProductBYCategory)

// 3 Delete product 
Product_router.delete('/v4/api/delete/product', SellerAuthMiddleware, DeleteProduct)

// 4. Update Product
Product_router.put('/v4/api/update/product', SellerAuthMiddleware, UpdateProduct)

//  Product Varients
Product_router.get('/v3/api/product/varientById/:id', fetchProductVarient)

// 5. Create Product varient
Product_router.post('/v4/api/create/product/varient', SellerAuthMiddleware, CreateProductVarient)


// 6. fetch prduct varient
Product_router.get('/v4/api/get_all/product/varients', SellerAuthMiddleware, Get_All_ProductVarients)

//  7 . fetch product by varient id or product id
Product_router.get('/v4/api/get_product_varient/', SellerAuthMiddleware, fetch_Product_By_Id_Or_ProductId)

//  8 delete product varient
Product_router.delete('/v4/api/delete/product/varient', SellerAuthMiddleware, DeleteVarients)

// 9 update product varient
Product_router.put('/v4/api/update/product/varient', SellerAuthMiddleware, UpdataVarients)

//  10 Product reviews
Product_router.post('/v4/api/product/reviews', UserAuthMiddleware, CreateRatings)


Product_router.get('/v4/api/get/similar/product', SimilarProducts)

module.exports = Product_router;