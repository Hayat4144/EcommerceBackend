const epxress = require('express');
const { SigninSeller } = require('../auth/SigninSelller');
const { SignupSeller } = require('../auth/SignupSeller');
const SellerAuthMiddleware = require('../../Middleware/SellerAuthMiddleware');
const { ChangePassword } = require('../auth/ChangePassword');
const SellerRouter = epxress.Router();

// 1. Signup for Seller route
SellerRouter.post('/v4/api/seller/signup', SignupSeller)

// 2 Signin for seller route
SellerRouter.post('/v4/api/seller/signin', SigninSeller)

// 3 change password for seller
SellerRouter.put('/v4/api/seller/change/password', SellerAuthMiddleware, ChangePassword)
module.exports = SellerRouter;