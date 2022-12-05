const express = require('express');
const { CreateProduct } = require('../Api/CreateProduct');
const { DeleteProduct } = require('../Api/DeleteProduct');
const { Get_All_Product } = require('../Api/Get_All_Product');
const { UpdateProduct } = require('../Api/UpdataProduct');
const Product_router = express.Router();


// Product Routers

// 1. Create Product 
Product_router.post('/v4/api/create/product' , CreateProduct)

// 2. get all product 
Product_router.get('/v4/api/get_all/product',Get_All_Product)

// 3 Delete product 
Product_router.delete('/v4/api/delete/product',DeleteProduct)

// 4. Update Product
Product_router.put('/v4/api/update/product',UpdateProduct)


module.exports  = Product_router ;