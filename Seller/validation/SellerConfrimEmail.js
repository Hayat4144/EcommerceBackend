const { check, validationResult } = require('express-validator')

exports.SellerConfirmEmailValidate = [
    check('new_email')
        .isEmail()
        .trim()
        .escape()
        .withMessage('Sorry, invalid email')
        .custom((value, { req }) => {
            if (value !== req.body.confirmemail) {
                throw new Error("Email doesn't match");
            } else {
                return value;
            }
        })

]

exports.Seller_Confirm_Email_Validation_Error = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg })
    }
    else {
        next();
    }
}