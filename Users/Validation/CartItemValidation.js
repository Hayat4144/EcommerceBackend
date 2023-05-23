const { check, validationResult } = require("express-validator");
const ErrorHandler = require("../../utils/ErrorHandler");
const AsyncFunc = require("../../utils/AsyncFunc");

const CartValidation = [
  check("ProductId").isMongoId().withMessage("please provide valid product id"),
  check("quantity")
    .isFloat()
    .withMessage("Please provide valid quantity in number")
    .custom((value) => {
      if (value > 9) return true;
      throw new Error("quantity should be greater than 9");
    }),
];

const CartValidationError = AsyncFunc(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
});

module.exports = { CartValidation, CartValidationError };
