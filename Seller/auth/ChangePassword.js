const ErrorHandler = require('../../utils/ErrorHandler')
const SellerModel = require('../model/SellerModel')
const bcrypt = require('bcrypt')
const AsyncFunc = require('../../utils/AsyncFunc')

exports.ChangePassword = AsyncFunc(async (req, res, next) => {
  const { currentpassword, newpassword } = req.body;
  await SellerModel.findById(req.user_id)
    .exec(async (err, doc) => {
      if (err) {
        next(new ErrorHandler('Sorry , the data does not exist.', 400))
      }
      if (await bcrypt.compare(currentpassword, doc.password)) {
        const saltRound = 10;
        const hashpassword = await bcrypt.hash(newpassword, saltRound);
        await SellerModel.findByIdAndUpdate(doc._id, { $set: { password: hashpassword } }, { $new: true })
          .exec((error, doc) => {
            if (error) {
              next(new ErrorHandler(error.message, 400))
            }
            else {
              if (doc === null) {
                return res.status(400).json({ 'error': `Sorry , User does not exist` })
              }
              return res.status(200).json({ data: "The password has been changed successfully." })
            }
          })
      }
      else {
        next(new ErrorHandler('Sorry,  your password is wrong try again.', 400))
      }
    })

})
