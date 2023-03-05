const {check,ValidationResult, validationResult} = require('express-validator')

exports.ProductValidtion = [
    check('name')
    .isLength({max:50,min:4})
    .escape()
    .withMessage('Name should be 5-50 character long.'),
    check('brand')
    .isLength({min:4,max:30})
    .escape()
    .withMessage('Brand should be 5-30 character long.'),
    check('description')
    .isLength({min:4,max:200})
    .escape()
    .withMessage('Description should be 4-200 character long.'),
    check('price')
    .isNumeric()
    .isLength({min:2,max:6})
    .escape()
    .trim()
    .withMessage('Price only contians number .'),
    check('attributes_name')
    .isString()
    .escape()
    .isLength({min:4,max:100})
    .withMessage('Attributes can not be empty.')
]


exports.ProductValidationError = (req,res,next)=>{
    const errors = validationResult(req) ;
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg })
    }
    else {
        next();
    } 
}