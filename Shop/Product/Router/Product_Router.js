const express = require('express');
const { CreateProduct } = require('../Api/CreateProduct');
const { DeleteProduct } = require('../Api/DeleteProduct');
const { Get_All_Product } = require('../Api/Get_All_Product');
const { UpdateProduct } = require('../Api/UpdataProduct');
const SellerAuthMiddleware = require('../../../Middleware/SellerAuthMiddleware');
const { CreateProductVarient } = require('../Api/varients/CrProductVarient');
const { Get_All_ProductVarients, fetch_Product_By_Id_Or_ProductId } = require('../Api/varients/FetchProductVarients');
const { DeleteVarients } = require('../Api/varients/DltVarients');
const { UpdataVarients } = require('../Api/varients/UpdVarients');
const Product_router = express.Router();


// Product Routers

// 1. Create Product 
Product_router.post('/v4/api/create/product' , SellerAuthMiddleware,CreateProduct)

// 2. get all product 
Product_router.get('/v4/api/get_all/product',SellerAuthMiddleware,Get_All_Product)

// 3 Delete product 
Product_router.delete('/v4/api/delete/product',SellerAuthMiddleware,DeleteProduct)

// 4. Update Product
Product_router.put('/v4/api/update/product',SellerAuthMiddleware,UpdateProduct)

//  Product Varients

// 5. Create Product varient
Product_router.post('/v4/api/create/product/varient', SellerAuthMiddleware,CreateProductVarient)


// 6. fetch prduct varient
Product_router.get('/v4/api/get_all/product/varients', SellerAuthMiddleware,Get_All_ProductVarients)

//  7 . fetch product by varient id or product id
Product_router.get('/v4/api/get_product_varient/' ,SellerAuthMiddleware,fetch_Product_By_Id_Or_ProductId)

//  8 delete product varient
Product_router.delete('/v4/api/delete/product/varient', SellerAuthMiddleware,DeleteVarients)

// 9 update product varient
Product_router.put('/v4/api/update/product/varient' ,SellerAuthMiddleware,UpdataVarients)

module.exports  = Product_router ;