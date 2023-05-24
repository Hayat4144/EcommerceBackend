const { check, validationResult } = require("express-validator");
const AsyncFunc = require("../../../utils/AsyncFunc");

const VarientIdValidation = [
  check("varient_id").isMongoId().withMessage("Invalid Vairent id provided"),
];

const VrntValidationError = AsyncFunc(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
});

module.exports = { VarientIdValidation, VrntValidationError };
