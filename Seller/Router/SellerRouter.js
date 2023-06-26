const epxress = require("express");
const { SigninSeller } = require("../auth/SigninSelller");
const { SignupSeller } = require("../auth/SignupSeller");
const SellerAuthMiddleware = require("../../Middleware/SellerAuthMiddleware");
const { ChangePassword } = require("../auth/ChangePassword");
const { ResetPasswordRequest } = require("../auth/ResetPasswordRequest");
const { VerifySellerPasswordReset } = require("../auth/VerifyPasswordReset");
const { EmailChangeRequest } = require("../auth/EmailChangeRequest");
const { VerifySellerEmailChange } = require("../auth/VerifyEmailChange");
const { CreateSellerAddress } = require("../Address/CreateSellerAddress");
const { UpdateSellerAddress } = require("../Address/UpdateSellerAddres");
const { ReadSelerAddress } = require("../Address/ReadSellerAddress");
// const { SellerProfileImage } = require('../Profile/Upload_Profile_Pic');
const {
  SellerValidate,
  Seller_Validation_Error,
} = require("../validation/SellerValidation");
const {
  Seller_AddressValidation,
  Seller_Address_validation_Error,
} = require("../validation/SelllerAddressValidation");
const {
  SellerEmailValidate,
  Seller_Email_Validation_Error,
} = require("../validation/SellerEmailValidation");
const {
  ConfrimPasswordValidate,
  Confirm_Password_Validation_Error,
} = require("../validation/ConfirmPasswordValidation");
const {
  SellerConfirmEmailValidate,
  Seller_Confirm_Email_Validation_Error,
} = require("../validation/SellerConfrimEmail");
const { SellerLogut } = require("../auth/SellerLogut");
const { ReadOrder } = require("../Order/ReadOrder");
const { SellerOrder } = require("../Order/OrderSample");
const { TotalOrders, TodayOrders } = require("../Order/TotalOrders");
const { UpdateOrder } = require("../Order/UpdateOrder");
const OrderByDate = require("../Order/OrderByDate");
// const upload = require('../../utils/upload');

const SellerRouter = epxress.Router();

// 1. Signup for Seller route
SellerRouter.post(
  "/v4/api/seller/signup",
  SellerValidate,
  Seller_Validation_Error,
  SignupSeller
);

// 2 Signin for seller route
SellerRouter.post("/v4/api/seller/signin", SigninSeller);

SellerRouter.post("/v4/api/seller/logout", SellerLogut);

// 3 change password for seller
SellerRouter.put(
  "/v4/api/seller/change/password",
  ConfrimPasswordValidate,
  Confirm_Password_Validation_Error,
  SellerAuthMiddleware,
  ChangePassword
);

// 4 Reset password request
SellerRouter.post(
  "/v4/api/seller/reset/password/request",
  SellerAuthMiddleware,
  SellerEmailValidate,
  Seller_Email_Validation_Error,
  ResetPasswordRequest
);

// 4 Verify password reset
SellerRouter.put(
  "/v4/api/seller/password/reset/done",
  SellerAuthMiddleware,
  ConfrimPasswordValidate,
  Confirm_Password_Validation_Error,
  VerifySellerPasswordReset
);

//  5 email change request
SellerRouter.post(
  "/v4/api/seller/email/change/request",
  SellerAuthMiddleware,
  SellerEmailValidate,
  Seller_Email_Validation_Error,
  EmailChangeRequest
);

// 6 verify email change token
SellerRouter.put(
  "/v4/api/seller/email/change/done",
  SellerAuthMiddleware,
  SellerConfirmEmailValidate,
  Seller_Confirm_Email_Validation_Error,
  VerifySellerEmailChange
);

// 7 user address create
SellerRouter.post(
  "/v4/api/seller/create/address",
  SellerAuthMiddleware,
  Seller_AddressValidation,
  Seller_Address_validation_Error,
  CreateSellerAddress
);

SellerRouter.get(
  "/v4/api/seller/read/address",
  SellerAuthMiddleware,
  ReadSelerAddress
);

SellerRouter.put(
  "/v3/api/seller/update/address",
  Seller_AddressValidation,
  Seller_Address_validation_Error,
  SellerAuthMiddleware,
  UpdateSellerAddress
);

SellerRouter.post("/v4/api/seller/order", SellerAuthMiddleware, SellerOrder);

SellerRouter.get(
  "/v4/api/seller/order/by/date",
  SellerAuthMiddleware,
  OrderByDate
);

SellerRouter.get("/v4/api/seller/orderbyId", SellerAuthMiddleware, ReadOrder);

SellerRouter.get(
  "/v4/api/seller/total/orders",
  SellerAuthMiddleware,
  TotalOrders
);

SellerRouter.get(
  "/v4/api/seller/today/orders",
  SellerAuthMiddleware,
  TodayOrders
);

SellerRouter.post(
  "/v4/api/seller/order/update",
  SellerAuthMiddleware,
  UpdateOrder
);
// SellerRouter.post('/v3/api/seller/profile/upload', upload.single('avtar'), SellerAuthMiddleware, SellerProfileImage)

module.exports = SellerRouter;
