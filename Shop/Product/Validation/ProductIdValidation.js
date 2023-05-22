const { check, validationResult } = require("express-validator");
const AsyncFunc = require("../../../utils/AsyncFunc");

exports.ProductIdValidation = [
  check("product_id")
    .isMongoId()
    .withMessage("Please provide a valid product id"),
];

exports.ProductIdError = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};
