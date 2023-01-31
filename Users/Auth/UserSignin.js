const ErrorHandler = require('../../utils/ErrorHandler')
const AsyncFunc = require('../../utils/AsyncFunc');
const UserModel = require('../Model/UserModel');
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')

exports.UserSignin = AsyncFunc(async (req, res, next) => {
    const { email, password } = req.body;
    const IsUserExist = await UserModel.findOne({ email: email });
    if (!IsUserExist) {
        return next(new ErrorHandler('Sorry, Invalid/Credentials', 400))
    }
    if (IsUserExist && (await bcrypt.compare(password, IsUserExist.password))) {

        // signinoptions for jwt sign
        var signOptions = {
            expiresIn: "10d",
            algorithm: "ES256"
        };

        // jwt payload
        const payload = {
            id: IsUserExist._id,
            email: IsUserExist.email,
            name: IsUserExist.firstName + ' ' + IsUserExist.lastName,
        }

        // read the private key file and sign a token if no error occured
        fs.readFile('./private.ec.key', 'utf-8', (err, data) => {
            if (!err) {
                const token = jwt.sign(payload, data, signOptions);
                if (process.env.NODE_ENV === "production") {
                    res.cookie('token', token,{
                        expires: new Date(Date.now() + 864000000), // for 10 days in production only 864000000
                        sameSite:'none',
                        secure:true,
                     }
                     )
                }else{
                    res.cookie('token_dev', token, {
                        expires: new Date(Date.now() + 864000000), 
                        sameSite:'none',
                        secure :true,
                    })
                }
                
                return res.status(200).send({ data: 'Login Successfull.' })
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