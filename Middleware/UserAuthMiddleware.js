const jwt = require("jsonwebtoken");
const fs = require("fs");
const User_Model = require("../Users/Model/UserModel");
const ErrorHandler = require("../utils/ErrorHandler");
const jwt_signin_verify_option = require("../global/Jwt_verify_signin_option");
const logger = require("../utils/Logger");
const path = require("path");

const UserAuthMiddleware = async (req, res, next) => {
  try {
    const jwt_token =
      process.env.NODE_ENV === "production"
        ? req.cookies.token
        : req.cookies.token_dev;

    if (jwt_token === undefined) {
      return res.status(401).json({ error: "you are unauthorized." });
    }
    const file = path.join(process.cwd(), "public.pem");
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      jwt.verify(
        jwt_token,
        data,
        jwt_signin_verify_option,
        async (error, data) => {
          if (error) {
            const message =
              error.name === error.message
                ? "you are unauthorized"
                : error.message;
            return next(new ErrorHandler(message, 401));
          }
          await User_Model.findById(data.id).exec((err, doc) => {
            if (err) {
              return res.status(401).json({ error: "you are unauthorised" });
            }
            if (doc === null)
              return next(
                new ErrorHandler("you data has not been found.", 401)
              );
            req.user_id = doc._id;
            req.email = doc.email;
            req.name = data.name;
            next();
          });
        }
      );
    });
  } catch (error) {
    logger.error(error);
  }
};

module.exports = UserAuthMiddleware;
