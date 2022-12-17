const { check, validationResult } = require('express-validator')


exports.UserEmailValidate = [
    check('current_email')
        .isEmail()
        .trim()
        .escape()
        .withMessage('Sorry, invalid email')
]

exports.User_Email_Validation_Error = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg })
    }
    else {
        next();
    }
}