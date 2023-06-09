const {
  check,
  ValidationResult,
  validationResult,
} = require("express-validator");
const ErrorHandler = require("../../../utils/ErrorHandler");
const mongoose = require("mongoose");

exports.ProductValidtion = [
  check("name")
    .isLength({ max: 300, min: 4 })
    .withMessage("Name should be 5-50 character long."),
  check("description")
    .escape()
    .trim()
    .isLength({ min: 4, max: 3000 })
    .withMessage("Description should be 4-200 character long."),
  check("price")
    .escape()
    .trim()
    .isLength({ min: 2, max: 6 })
    .withMessage("Price between be 10 - 100000")
    .custom((value) => {
      value = parseInt(value);
      if (!isNaN(value))
        return new ErrorHandler("Price only contians number", 400);
      return value;
    }),
  check("stock")
    .escape()
    .trim()
    .isLength({ min: 2, max: 6 })
    .withMessage("Stock between be 10 to 1000 .")
    .custom((value) => {
      value = parseInt(value);
      if (!isNaN(value))
        return new ErrorHandler("Stock only contians number", 400);
      return value;
    }),
  check("attributes_name")
    .trim()
    .isLength({ min: 4, max: 200 })
    .withMessage("Attributes can not be empty."),
  check("category")
    .trim()
    .isLength({ min: 4, max: 60 })
    .withMessage("category is not a valid id."),
];

exports.ProductValidationError = (req, res, next) => {
  const errors = validationResult(req);
  console.log(req.body);
  if (!errors.isEmpty()) {
    // console.log(errors.array());
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};
