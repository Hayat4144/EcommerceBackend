const Seller_Model = require('../model/SellerModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const ErrorHandler = require('../../../utils/ErrorHandler')
const fs = require('fs')
const path = require('path')


exports.SigninSeller = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const IsSellerExist = await Seller_Model.findOne({ email: email });
        if (!IsSellerExist) {
            return next(new ErrorHandler('Sorry, Invalid/Credentials', 400))
        }
        if (IsSellerExist && (await bcrypt.compare(password, IsSellerExist.password))) {

            // signinoptions for jwt sign
            var signOptions = {
                expiresIn: "5m",
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
                        expires: new Date(Date.now() + 300000), // for 10 days in production only 864000000
                        SameSite: 'none',
                    })
                    return res.status(200).send({ data: 'Login Successfully.' })
                }
                else {
                    throw err;
                }
            })


        }
        else {
            return next(new ErrorHandler('Sorry, Invalid/Credentials', 400))
        }

    } catch (error) {
        console.log(error)
    }
}