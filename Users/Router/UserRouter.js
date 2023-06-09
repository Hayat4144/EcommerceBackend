const express = require("express");
const UserAuthMiddleware = require("../../Middleware/UserAuthMiddleware");
const { UserPasswordReset } = require("../Auth/ResetUserPassword");
const { UserChangePassword } = require("../Auth/UserChangePassword");
const { UserEmailChange } = require("../Auth/UserEmailChange");
const { UserSignin } = require("../Auth/UserSignin");
const { UserSignup } = require("../Auth/UserSignup");
const { VerifyEmailChange } = require("../Auth/VerfiyEmailChange");
const { VerifyPasswordChange } = require("../Auth/VerifyPasswordReset");
const { CreateUserAddress } = require("../Address/api/CreateAddress");
const { ReadUserAddress } = require("../Address/api/ReadUserAddress");
const { UpdateUserAddress } = require("../Address/api/UpdateUserAddress");
const { UserProfileImage } = require("../Profile/userprofile_upload");
const {
  AddressValidation,
  Address_validation_Error,
} = require("../Validation/AddressValidations");
const {
  UserValidate,
  User_Validation_Error,
} = require("../Validation/UserValidation");
const {
  UserEmailValidate,
  User_Email_Validation_Error,
} = require("../Validation/UserEmailValidation");
const {
  ConfirmEmailValidate,
  Confirm_Email_Validation_Error,
} = require("../Validation/EmailConfirmValidate");
const {
  ConfrimPasswordValidate,
  Confirm_Password_Validation_Error,
} = require("../../Seller/validation/ConfirmPasswordValidation");
// const upload = require('../../utils/upload');
const { CreateCartItem } = require("../Cart/Cart");
const ConfirmPayment = require("../Order/ConfirmPayment");
const {
  OrderValidation,
  MakeOrder_Validation_Error,
} = require("../Validation/MakeOrderValidations");
const { UserOrder } = require("../Order/UserOrder");
const { Logout } = require("../Auth/Logout");
const { CheckAuth } = require("../Auth/CheckAuth");
const {
  CartValidation,
  CartValidationError,
} = require("../Validation/CartItemValidation");
const GetCartItem = require("../Cart/ReadCartItem");
const UpdateCartItem = require("../Cart/UpdateCartItem");
const DeleteCartItem = require("../Cart/DeleteCartItem");
const {
  ArrayMongoIdvalidation,
  ArrayMongoErrors,
} = require("../Validation/DeleteCartItemValidation");
const Order = require("../Order/Order");
const Payment = require("../Order/Payment");
const UserRouter = express.Router();

UserRouter.get("/hello", (req, res) => {
  return res.status(200).send("hello world");
});

// 1. Signup for user
UserRouter.post(
  "/v3/api/user/signup",
  UserValidate,
  User_Validation_Error,
  UserSignup
);

// 2 Sigin for user
UserRouter.post("/v3/api/user/signin", UserSignin);

UserRouter.get("/v3/api/user/logout", UserAuthMiddleware, Logout);

UserRouter.get("/v3/is/user/authenticate", UserAuthMiddleware, CheckAuth);

// 3 Change Password for user
UserRouter.put(
  "/v3/api/user/change/password",
  UserAuthMiddleware,
  ConfrimPasswordValidate,
  Confirm_Password_Validation_Error,
  UserChangePassword
);

// Reset password request
UserRouter.post(
  "/v3/api/user/reset/password/request",
  UserEmailValidate,
  User_Email_Validation_Error,
  UserAuthMiddleware,
  UserPasswordReset
);

// Verify reset password token
UserRouter.put(
  "/v3/api/user/reset/password/verify/done",
  ConfrimPasswordValidate,
  Confirm_Password_Validation_Error,
  UserAuthMiddleware,
  VerifyPasswordChange
);

// 4. change user email step 1
UserRouter.post(
  "/v3/api/user/change/email/request",
  UserEmailValidate,
  User_Email_Validation_Error,
  UserAuthMiddleware,
  UserEmailChange
);

// 5 verify email token and update the email
UserRouter.put(
  "/v3/api/user/change/email/verify/done",
  ConfirmEmailValidate,
  Confirm_Email_Validation_Error,
  UserAuthMiddleware,
  VerifyEmailChange
);

// 6 user address create
UserRouter.post(
  "/v3/api/user/create/address",
  AddressValidation,
  Address_validation_Error,
  UserAuthMiddleware,
  CreateUserAddress
);

UserRouter.get(
  "/v3/api/user/read/address",
  UserAuthMiddleware,
  ReadUserAddress
);

UserRouter.put(
  "/v3/api/user/update/address",
  AddressValidation,
  Address_validation_Error,
  UserAuthMiddleware,
  UpdateUserAddress
);

// UserRouter.post('/v3/api/user/upload/profile', UserAuthMiddleware, upload.single('avtar'),
//     UserProfileImage)

UserRouter.post(
  "/v3/api/user/create/cart",
  UserAuthMiddleware,
  CartValidation,
  CartValidationError,
  CreateCartItem
);

UserRouter.get("/v3/api/user/read/cartitem", UserAuthMiddleware, GetCartItem);

UserRouter.put(
  "/v3/api/user/update/cartitem",
  UserAuthMiddleware,
  UpdateCartItem
);

UserRouter.delete(
  "/v3/api/user/delete/cartitem",
  UserAuthMiddleware,
  ArrayMongoIdvalidation,
  ArrayMongoErrors,
  DeleteCartItem
);

UserRouter.get("/v3/api/user/orders/history", UserAuthMiddleware, UserOrder);

UserRouter.post(
  "/v3/api/user/order",
  OrderValidation,
  MakeOrder_Validation_Error,
  UserAuthMiddleware,
  Order
);

UserRouter.post(
  "/v3/api/order/payment",
  UserAuthMiddleware,
  OrderValidation,
  MakeOrder_Validation_Error,
  Payment
);

// UserRouter.post(
//   "/v3/api/user/shop/order",
//   OrderValidation,
//   MakeOrder_Validation_Error,
//   UserAuthMiddleware,
//   ProductOrdered
// );

UserRouter.post(
  "/v3/api/user/shop/confirm/payment",
  UserAuthMiddleware,
  ConfirmPayment
);

module.exports = UserRouter;
