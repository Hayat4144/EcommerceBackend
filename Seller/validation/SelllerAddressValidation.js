const { check, validationResult } = require('express-validator');

exports.Seller_AddressValidation = [
    check('pincode')
        .isNumeric()
        .isLength({ max: 6, min: 6 })
        .withMessage('pin code should be 6 character.'),
    check('Street')
        .isLength({ min: 5, max: 200 })
        .trim()
        .escape()
        .withMessage('Street should be mininum 5 character and maximum 200.'),
    check('Area')
        .isLength({ min: 5, max: 200 })
        .trim()
        .escape()
        .withMessage('Area should be mininum 5 character and maximum 200.'),
    check('city')
        .isLength({ min: 5, max: 200 })
        .trim()
        .escape()
        .withMessage('city should be mininum 5 character and maximum 200.'),
    check('State')
        .isLength({ min: 5, max: 200 })
        .trim()
        .escape()
        .withMessage('State should be mininum 5 character and maximum 200.'),
    check('Country')
        .isLength({ min: 2, max: 30 })
        .trim()
        .escape()
        .withMessage('Country should be mininum 5 character and maximum 30.'),
]


exports.Seller_Address_validation_Error = (req, res, next) => {
    const error = validationResult(req);
    console.log(error)
    if (!error.isEmpty()) {
        res.status(400).send({ error: error.array()[0].msg })
    }
    else {
        next()
    }
}




