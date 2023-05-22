const { check, validationResult } = require("express-validator");

exports.ConfrimPasswordValidate = [
  check("newpassword")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .trim()
    .escape()
    .withMessage(
      "password must be contain symbol,number,capital and small letter having 8 character."
    )
    .custom((value, { req, loc, path }) => {
      if (value !== req.body.confirmpassword) {
        throw new Error("password doesn't match");
      } else {
        return value;
      }
    }),
  check("currentpassword")
    .isLength({min:1})
    .withMessage(`old password can't be empty.`)
];

exports.Confirm_Password_Validation_Error = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
  } else {
    next();
  }
};
