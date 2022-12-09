const express = require('express');
const UserAuthMiddleware = require('../../Middleware/UserAuthMiddleware');
const { UserPasswordReset } = require('../Auth/ResetUserPassword');
const { UserChangePassword } = require('../Auth/UserChangePassword');
const { UserEmailChange } = require('../Auth/UserEmailChange');
const { UserSignin } = require('../Auth/UserSignin');
const { UserSignup } = require('../Auth/UserSignup');
const { VerifyEmailChange } = require('../Auth/VerfiyEmailChange');
const { VerifyPasswordChange } = require('../Auth/VerifyPasswordReset');
const UserRouter = express.Router();

// User router

// 1. Signup for user
UserRouter.post('/v3/api/user/signup', UserSignup)

// 2 Sigin for user
UserRouter.post('/v3/api/user/sigin', UserSignin)

// 3 Change Password for user 
UserRouter.put('/v3/api/user/change/password', UserAuthMiddleware, UserChangePassword)

// Reset password request
UserRouter.post('/v3/api/user/reset/password/request', UserAuthMiddleware, UserPasswordReset)

// Verify reset password token 
UserRouter.put('/v3/api/user/reset/password/verify/done', UserAuthMiddleware, VerifyPasswordChange)

// 4. change user email step 1 
UserRouter.post('/v3/api/user/change/email/request', UserAuthMiddleware, UserEmailChange)

// 5 verify email token and update the email
UserRouter.put('/v3/api/user/change/email/verify/done', UserAuthMiddleware, VerifyEmailChange)

module.exports = UserRouter;