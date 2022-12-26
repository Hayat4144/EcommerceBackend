const express = require('express');
const UserAuthMiddleware = require('../../Middleware/UserAuthMiddleware');
const { UserPasswordReset } = require('../Auth/ResetUserPassword');
const { UserChangePassword } = require('../Auth/UserChangePassword');
const { UserEmailChange } = require('../Auth/UserEmailChange');
const { UserSignin } = require('../Auth/UserSignin');
const { UserSignup } = require('../Auth/UserSignup');
const { VerifyEmailChange } = require('../Auth/VerfiyEmailChange');
const { VerifyPasswordChange } = require('../Auth/VerifyPasswordReset');
const { CreateUserAddress } = require('../Address/api/CreateAddress');
const { ReadUserAddress } = require('../Address/api/ReadUserAddress');
const { UpdateUserAddress } = require('../Address/api/UpdateUserAddress');
const { UserProfileImage } = require('../Profile/userprofile_upload');
const { AddressValidation, Address_validation_Error } = require('../Validation/AddressValidations');
const { UserValidate, User_Validation_Error } = require('../Validation/UserValidation');
const { UserEmailValidate, User_Email_Validation_Error } = require('../Validation/UserEmailValidation');
const { ConfirmEmailValidate, Confirm_Email_Validation_Error } = require('../Validation/EmailConfirmValidate');
const { ConfrimPasswordValidate, Confirm_Password_Validation_Error } = require('../../Seller/validation/ConfirmPasswordValidation');
const upload = require('../../utils/upload');
const { ht } = require('../Profile/ht');
const { CreateCartItem } = require('../Cart/Cart');




const UserRouter = express.Router();

// User router
UserRouter.post('/api/data', upload.single('avtar'), ht)


// 1. Signup for user
UserRouter.post('/v3/api/user/signup', UserValidate, User_Validation_Error, UserSignup)

// 2 Sigin for user
UserRouter.post('/v3/api/user/signin', UserSignin)

// 3 Change Password for user 
UserRouter.put('/v3/api/user/change/password', ConfrimPasswordValidate,
    Confirm_Password_Validation_Error, UserAuthMiddleware, UserChangePassword)

// Reset password request
UserRouter.post('/v3/api/user/reset/password/request', ConfrimPasswordValidate,
    Confirm_Password_Validation_Error, UserAuthMiddleware, UserPasswordReset)

// Verify reset password token 
UserRouter.put('/v3/api/user/reset/password/verify/done', ConfrimPasswordValidate,
    Confirm_Password_Validation_Error, UserAuthMiddleware, VerifyPasswordChange)

// 4. change user email step 1 
UserRouter.post('/v3/api/user/change/email/request', UserEmailValidate,
    User_Email_Validation_Error, UserAuthMiddleware, UserEmailChange)

// 5 verify email token and update the email
UserRouter.put('/v3/api/user/change/email/verify/done', ConfirmEmailValidate,
    Confirm_Email_Validation_Error, UserAuthMiddleware, VerifyEmailChange)

// 6 user address create 
UserRouter.post('/v3/api/user/create/address', AddressValidation,
    Address_validation_Error, UserAuthMiddleware, CreateUserAddress)

UserRouter.get('/v3/api/user/read/address', UserAuthMiddleware, ReadUserAddress)


UserRouter.put('/v3/api/user/update/address', AddressValidation, Address_validation_Error,
    UserAuthMiddleware, UpdateUserAddress)

UserRouter.post('/v3/api/user/upload/profile', UserAuthMiddleware, upload.single('avtar'),
    UserProfileImage)


UserRouter.post('/v3/api/user/create/cart', UserAuthMiddleware, CreateCartItem)

module.exports = UserRouter;
