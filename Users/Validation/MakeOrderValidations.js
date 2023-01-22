const { check, validationResult } = require('express-validator');

exports.OrderValidation = [
    check('products')
    .isArray()
    .isLength({min:1})
    .withMessage('Products can not be empty.'),
]

exports.MakeOrder_Validation_Error = (req, res, next) => {
    const error = validationResult(req);
    console.log(error)
    if (!error.isEmpty()) {
        res.status(400).send({ error: error.array()[0].msg })
    }
    else {
        next()
    }
}