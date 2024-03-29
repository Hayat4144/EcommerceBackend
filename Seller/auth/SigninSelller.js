const Seller_Model = require('../model/SellerModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const ErrorHandler = require('../../utils/ErrorHandler')
const fs = require('fs')
const path = require('path')
const AsyncFunc = require('../../utils/AsyncFunc')


exports.SigninSeller = AsyncFunc(async (req, res, next) => {
    const { email, password } = req.body;
    const IsSellerExist = await Seller_Model.findOne({ email: email });
    if (!IsSellerExist) {
        return next(new ErrorHandler('Sorry, Invalid/Credentials', 400))
    }
    if (IsSellerExist && (await bcrypt.compare(password, IsSellerExist.password))) {

        // signinoptions for jwt sign
        var signOptions = {
            expiresIn: "12d",
            algorithm: "ES256"
        };

        // jwt payload
        const payload = {
            id: IsSellerExist._id,
            email: IsSellerExist.email,
            name: IsSellerExist.name,
            store_name: IsSellerExist.store_name,
            is_varified: IsSellerExist.is_varified,
        }

        // read the private key file and sign a token if no error occured
        fs.readFile('./private.ec.key', 'utf-8', (err, data) => {
            if (!err) {
                const token = jwt.sign(payload, data, signOptions);
                if (process.env.NODE_ENV === "production") {
                    res.cookie('token_production', token, {
                        expires: new Date(Date.now() + 864000000), // for 10 days in production only 864000000
                        sameSite: 'none',
                        secure: true
                    }
                    )
                } else {
                    res.cookie('token_dev', token, {
                        expires: new Date(Date.now() + 864000000), // for 10 days in production only 864000000
                        sameSite: 'none',
                    })
                }
                return res.status(200).send({ data: 'Login Successfully.', token })
            }
            else {
                throw err;
            }
        })


    }
    else {
        return res.status(400).json({error:`Sorry, Invalid/Credentials`})
    }

})