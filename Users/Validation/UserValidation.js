const { check, validationResult } = require('express-validator')


exports.UserValidate = [
    check('password')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          })
        .trim()
        .escape()
        .withMessage('password must be contain symbol,number,capital and small letter.')
        .custom((value, { req }) => {
            if (value !== req.body.confirmpassword) {
                throw new Error("password doesn't match");
            } else {
                return value;
            }
        }),
    check('firstName')
        .isLength({ min: 2, max: 15 })
        .trim()
        .escape()
        .withMessage('First Name should be minimum 4 and maximum 15 character.'),
    check('lastName')
        .isLength({ min: 2, max: 15 })
        .trim()
        .escape()
        .withMessage('Last Name should be minimum 4 and maximum 15 character.'),
    check('email')
        .isEmail()
        .trim()
        .escape()
        .withMessage('Invalid email')
]

exports.User_Validation_Error = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg })
    }
    else {
        next();
    }
}