const { check, validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

exports.OrderValidation = [
  check("products")
    .isArray({ min: 1 })
    .withMessage("Products can not be empty.")
    .custom((value) => {
      for (const product of value) {
        if (!mongoose.Types.ObjectId.isValid(product.ProductId)) {
          throw new Error("Invalid Product id");
        }
        if (typeof product.quantity !== 'number') {
          throw new Error("quantity should be a number");
        }
        if (product.quantity <= 9) {
          throw new Error("quantity should be greater than 9");
        }
        return true;
      }
    }),
  check("payment_type")
    .isString()
    .withMessage("provide valid payment_type.")
    .custom((value) => {
      if (value !== "CARD" && value !== "CASHONDELIVERY") {
        throw new Error("Invalid payment type.");
      }
      return true;
    })
];

exports.MakeOrder_Validation_Error = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.status(400).send({ error: error.array()[0].msg });
  } else {
    next();
  }
};
