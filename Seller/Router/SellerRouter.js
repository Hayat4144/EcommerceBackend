const epxress = require('express');
const { SigninSeller } = require('../auth/SigninSelller');
const { SignupSeller } = require('../auth/SignupSeller');
const SellerAuthMiddleware = require('../../Middleware/SellerAuthMiddleware');
const { ChangePassword } = require('../auth/ChangePassword');
const { ResetPasswordRequest } = require('../auth/ResetPasswordRequest');
const { VerifySellerPasswordReset } = require('../auth/VerifyPasswordReset');
const { EmailChangeRequest } = require('../auth/EmailChangeRequest');
const { VerifySellerEmailChange } = require('../auth/VerifyEmailChange');
const { CreateSellerAddress } = require('../Address/CreateSellerAddress');
const { UpdateSellerAddress } = require('../Address/UpdateSellerAddres');
const { ReadSelerAddress } = require('../Address/ReadSellerAddress');
const { SellerProfileImage } = require('../Profile/Upload_Profile_Pic');
const { SellerValidate, Seller_Validation_Error } = require('../validation/SellerValidation');
const { Seller_AddressValidation, Seller_Address_validation_Error } = require('../validation/SelllerAddressValidation');
const { SellerEmailValidate, Seller_Email_Validation_Error } = require('../validation/SellerEmailValidation');
const { ConfrimPasswordValidate, Confirm_Password_Validation_Error } = require('../validation/ConfirmPasswordValidation');
const { SellerConfirmEmailValidate, Seller_Confirm_Email_Validation_Error } = require('../validation/SellerConfrimEmail');
const upload = require('../../utils/upload');
const { ht } = require('../../Users/Profile/ht');


const SellerRouter = epxress.Router();

SellerRouter.post('/hello', upload.single('avtar'), ht)

// 1. Signup for Seller route
SellerRouter.post('/v4/api/seller/signup', SellerValidate, Seller_Validation_Error, SignupSeller)

// 2 Signin for seller route
SellerRouter.post('/v4/api/seller/signin', SigninSeller)

// 3 change password for seller
SellerRouter.put('/v4/api/seller/change/password', ConfrimPasswordValidate,
    Confirm_Password_Validation_Error, SellerAuthMiddleware, ChangePassword)

// 4 Reset password request
SellerRouter.post('/v4/api/seller/reset/password/request', SellerEmailValidate,
    Seller_Email_Validation_Error, SellerAuthMiddleware, ResetPasswordRequest)

// 4 Verify password reset 
SellerRouter.put('/v4/api/seller/password/reset/done',
    ConfrimPasswordValidate, Confirm_Password_Validation_Error,
    SellerAuthMiddleware, VerifySellerPasswordReset)


//  5 email change request 
SellerRouter.post('/v4/api/seller/email/change/request', SellerEmailValidate,
    Seller_Email_Validation_Error,
    SellerAuthMiddleware, EmailChangeRequest)


// 6 verify email change token
SellerRouter.put('/v4/api/seller/email/change/done', SellerConfirmEmailValidate,
    Seller_Confirm_Email_Validation_Error, SellerAuthMiddleware, VerifySellerEmailChange)


// 7 user address create 
SellerRouter.post('/v3/api/seller/create/address', Seller_AddressValidation,
    Seller_Address_validation_Error, SellerAuthMiddleware, CreateSellerAddress)

SellerRouter.get('/v3/api/seller/read/address', SellerAuthMiddleware, ReadSelerAddress)


SellerRouter.put('/v3/api/seller/update/address',
    Seller_AddressValidation, Seller_Address_validation_Error, SellerAuthMiddleware, UpdateSellerAddress)

SellerRouter.post('/v3/api/seller/profile/upload', upload.single('avtar'), SellerAuthMiddleware, SellerProfileImage)

module.exports = SellerRouter;