const jwt = require('jsonwebtoken');
const fs = require('fs')
const Seller_Model = require('../Seller/model/SellerModel');
const ErrorHandler = require('../utils/ErrorHandler')


const SellerAuthMiddleware = (req, res, next) => {
    const jwt_token = req.cookies.token;
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
                        // console.log(doc)
                        console.log(doc._id)
                        console.log('hi')
                        req.user_id = doc._id ;
                        next();
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