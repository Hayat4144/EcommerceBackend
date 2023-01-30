const jwt = require('jsonwebtoken');
const fs = require('fs')
const User_Model = require('../Users/Model/UserModel');
const ErrorHandler = require('../utils/ErrorHandler')


const UserAuthMiddleware = (req, res, next) => {
    const jwt_token = process.env.NODE_ENV === "production" ? req.cookies.token_production : req.cookies.token_dev;
    if (jwt_token === undefined) {
        return res.status(401).json({ error: "you are unauthorized." })
    }
    fs.readFile('./public.pem', 'utf8', async (err, data) => {
        if (!err) {
            const verify_option = {
                expiresIn: "10d",
                algorithm: ["ES256"]
            }
            const verify_token = jwt.verify(jwt_token, data, verify_option)
            if (verify_token) {
                await User_Model.findById(verify_token.id)
                    .exec((err, doc) => {
                        if (err) {
                            return res.status(400).json({ error: "Sorry you are not authorized." })
                        }
                        if (doc === null) {
                            next(new ErrorHandler('Sorry, you are trying to access private resources which are not allowed. you may be not a normal user.', 400))
                        }
                        else {
                            req.user_id = doc._id;
                            req.email = doc.email;
                            next();
                        }

                    })
            }
            else{
                return res.status(401).json({error:"you are unauthorised."})
            }

        }
        else {
            console.log(err)
            throw err;
        }
    })


}

module.exports = UserAuthMiddleware;