const epxress = require('express');
const { SigninSeller } = require('../auth/api/SigninSelller');
const { SignupSeller } = require('../auth/api/SignupSeller');
const SellerRouter = epxress.Router();

// 1. Signup for Seller route
SellerRouter.post('/v4/api/seller/signup', SignupSeller)

// 2 Signin for seller route
SellerRouter.post('/v4/api/seller/signin',SigninSeller)


module.exports = SellerRouter ;