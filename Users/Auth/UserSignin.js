const ErrorHandler = require('../../utils/ErrorHandler')
const AsyncFunc = require('../../utils/AsyncFunc');
const UserModel = require('../Model/UserModel');
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')

exports.UserSignin = AsyncFunc(async (req, res, next) => {
    const { email, password } = req.body;
    const IsSellerExist = await UserModel.findOne({ email: email });
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
                res.cookie('token', token, {
                    expires: new Date(Date.now() + 864000000), // for 10 days in production only 864000000
                    SameSite: 'none',
                })
                return res.status(200).send({ data: 'Login Successfully.' })
            }
            else {
                next(new ErrorHandler(err, 500))
            }
        })


    }
    else {
        return next(new ErrorHandler('Sorry, Invalid Credentials', 400))
    }
})