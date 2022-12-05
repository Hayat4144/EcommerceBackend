const epxress = require('express');
const { SignupSeller } = require('../api/SignupSeller');
const SellerRouter = epxress.Router();

// 1. Signup for Seller route
SellerRouter.post('/v4/api/seller/signup', SignupSeller)


module.exports = SellerRouter ;