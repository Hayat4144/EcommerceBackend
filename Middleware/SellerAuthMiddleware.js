const jwt = require("jsonwebtoken");
const fs = require("fs");
const Seller_Model = require("../Seller/model/SellerModel");
const ErrorHandler = require("../utils/ErrorHandler");
const jwt_signin_verify_option = require("../global/Jwt_verify_signin_option");
const path = require("path");

const SellerAuthMiddleware = async (req, res, next) => {
  try {
    const jwt_token =
      process.env.NODE_ENV === "production"
        ? req.cookies.token_production
        : req.cookies.token_dev;
    if (jwt_token === undefined) {
      return res.status(401).json({ error: "you are unauthorized." });
    }
    const file = path.join(process.cwd(), "public.pem");
    const cert = fs.readFileSync(file);
    jwt.verify(
      jwt_token,
      cert,
      jwt_signin_verify_option,
      async (error, data) => {
        if (error) {
          const message =
            error.name === "JsonWebTokenError"
              ? "you are unauthorized"
              : error.message;
          return next(new ErrorHandler(message, 401));
        }
        console.log(data);
        await Seller_Model.findById(data.id).exec((err, doc) => {
          if (err) return next(new ErrorHandler("you are unauthorised", 401));
          if (doc === null)
           return next(new ErrorHandler("you data has not been found.", 401));
          req.user_id = doc._id;
          req.email = doc.email;
          next();
        });
      }
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports = SellerAuthMiddleware;
