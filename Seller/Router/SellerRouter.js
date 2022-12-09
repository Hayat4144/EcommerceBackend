const epxress = require('express');
const { SigninSeller } = require('../auth/SigninSelller');
const { SignupSeller } = require('../auth/SignupSeller');
const SellerAuthMiddleware = require('../../Middleware/SellerAuthMiddleware');
const { ChangePassword } = require('../auth/ChangePassword');
const { ResetPasswordRequest } = require('../auth/ResetPasswordRequest');
const { VerifySellerPasswordReset } = require('../auth/VerifyPasswordReset');
const { EmailChangeRequest } = require('../auth/EmailChangeRequest');
const { VerifySellerEmailChange } = require('../auth/VerifyEmailChange');
const SellerRouter = epxress.Router();

// 1. Signup for Seller route
SellerRouter.post('/v4/api/seller/signup', SignupSeller)

// 2 Signin for seller route
SellerRouter.post('/v4/api/seller/signin', SigninSeller)

// 3 change password for seller
SellerRouter.put('/v4/api/seller/change/password', SellerAuthMiddleware, ChangePassword)

// 4 Reset password request
SellerRouter.post('/v4/api/seller/reset/password/request', SellerAuthMiddleware, ResetPasswordRequest)

// 4 Verify password reset 
SellerRouter.put('/v4/api/seller/password/reset/done', SellerAuthMiddleware, VerifySellerPasswordReset)


//  5 email change request 
SellerRouter.post('/v4/api/seller/email/change/request', SellerAuthMiddleware, EmailChangeRequest)


// 6 verify email change token
SellerRouter.put('/v4/api/seller/email/change/done', SellerAuthMiddleware, VerifySellerEmailChange)

module.exports = SellerRouter;