const { check, validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const AsyncFunc = require("../../utils/AsyncFunc");

const ArrayMongoIdvalidation = [
  check("cartItemIds")
    .isArray()
    .withMessage("cart ids should be an array")
    .custom((value) => {
      const isMongoIdContains = value.every((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      if (isMongoIdContains) return true;
      throw new Error("Invalid cart id contains");
    }),
];

const ArrayMongoErrors = AsyncFunc(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
});

module.exports = { ArrayMongoErrors, ArrayMongoIdvalidation };
