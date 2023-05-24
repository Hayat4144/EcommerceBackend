const { check, validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const AsyncFunc = require("../../../utils/AsyncFunc");

const VarientValidation = [
  check("VarientData")
    .isArray({ min: 1 })
    .withMessage("Provide atleast 1 varient")
    .custom((value) => {
      for (const varient of value) {
        if (!mongoose.Types.ObjectId.isValid(varient.productid)) {
          return new Error("Invlaid product id");
        }
        if (isNaN(varient.stock) || isNaN(varient.price))
          throw new Error("stock and price should be a number");

        if (varient.stock <= 0 || varient.price <= 0) {
          throw new Error("stock and price shoulde be greater than 0");
        }
        if (varient.attribute.length < 1) {
          throw new Error("varient attributes atleast 1 attribute");
        }
        const requiredFields = ["name", "value"];

        // Check if every object in the array has all the required fields
        const hasAllFields = varient.attribute.every((obj) => {
          return requiredFields.every(
            (field) => obj.hasOwnProperty(field)
          );
        });
        if (!hasAllFields)
          throw new Error("attribute and value should be greater than 0");
      }
      return true;
    }),
];

const VarientValidateError = AsyncFunc(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array()[0].msg });
  next();
});

module.exports = { VarientValidateError, VarientValidation };
