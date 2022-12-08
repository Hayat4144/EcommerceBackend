const express = require('express');
const UserAuthMiddleware = require('../../Middleware/UserAuthMiddleware');
const { UserChangePassword } = require('../Auth/UserChangePassword');
const { UserSignin } = require('../Auth/UserSignin');
const { UserSignup } = require('../Auth/UserSignup');
const UserRouter = express.Router();

// User router

// 1. Signup for user
UserRouter.post('/v3/api/user/signup', UserSignup)

// 2 Sigin for user
UserRouter.post('/v3/api/user/sigin', UserSignin)

// 3 Change Password for user 
UserRouter.put('/v3/api/user/change/password', UserAuthMiddleware, UserChangePassword)

module.exports = UserRouter;