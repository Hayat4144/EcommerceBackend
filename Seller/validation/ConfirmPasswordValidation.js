const { check, validationResult } = require('express-validator')


exports.ConfrimPasswordValidate = [
    check('new_password')
        .isStrongPassword()
        .trim()
        .escape()
        .withMessage('password must be contain symbol,number,capital and small letter.')
        .custom((value, { req, loc, path }) => {
            if (value !== req.body.confirmpassword) {
                throw new Error("passwords doesn't match");
            } else {
                return value;
            }
        }),

]

exports.Confirm_Password_Validation_Error = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg })
    }
    else {
        next();
    }
}