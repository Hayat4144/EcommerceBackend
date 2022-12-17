const { check, validationResult } = require('express-validator')


exports.UserValidate = [
    check('password')
        .isStrongPassword()
        .trim()
        .escape()
        .withMessage('password must be contain symbol,number,capital and small letter.')
        .custom((value, { req }) => {
            if (value !== req.body.confirmpassword) {
                throw new Error("passwords doesn't match");
            } else {
                return value;
            }
        }),
    check('name')
        .isLength({ min: 4, max: 15 })
        .trim()
        .escape()
        .withMessage('Name should be minimum 4 and maximum 15 character.'),
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