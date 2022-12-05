const express = require('express');
const { CreateProduct } = require('../Api/CreateProduct');
const Product_router = express.Router();


// Product Routers

// 1. Create Product 
Product_router.post('/v4/api/create/product' , CreateProduct)


module.exports  = Product_router ;