const jwt = require('jsonwebtoken');
const fs = require('fs')
const Seller_Model = require('../Seller/model/SellerModel');
const ErrorHandler = require('../utils/ErrorHandler')


const SellerAuthMiddleware = (req, res, next) => {
    const jwt_token =process.env.NODE_ENV === "production" ? req.cookies.token_production : req.cookies.token_dev;
    if (jwt_token === undefined) {
        return res.status(401).json({ error: "you are unauthorized." })
    }
    fs.readFile('./public.pem', 'utf8', async (err, data) => {
        if (!err) {
            const verify_option = {
                expiresIn: "12d",
                algorithm: ["ES256"]
            }
            const verify_token = jwt.verify(jwt_token, data, verify_option)
            if (verify_token) {
                await Seller_Model.findById(verify_token.id)
                    .exec((err, doc) => {
                        if (err) {
                            return res.status(400).json({ error: "Sorry you are not authorized." })
                        }
                        else {
                            if (doc === null) {
                                next(new ErrorHandler('Sorry, you are trying to access private resources which are not allowed. you may be not a seller.', 400))
                            }
                            else {
                                req.user_id = doc._id;
                                next();
                            }

                        }

                    })
            }

        }
        else {
            console.log(err)
            throw err;
        }
    })


}

module.exports = SellerAuthMiddleware;