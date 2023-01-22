const ErrorHandler = require("../../utils/ErrorHandler");
const AsyncFunc = require("../../utils/AsyncFunc");
const UserModel = require("../Model/UserModel");
const bcrypt = require("bcrypt");

exports.UserSignup = AsyncFunc(async (req, res, next) => {
  const { firstName,lastName, email, password } = req.body;
  const saltRound = 10;
  const hashpassword = await bcrypt.hash(password, saltRound);
  const create_user = {
    firstName,
    lastName,
    email,
    password: hashpassword,
  };
  await UserModel.create(create_user, (error, doc) => {
    if (!error) {
      return res
        .status(200)
        .json({ data: `${doc.email} has been created Successfully.` });
    } else {
      if (error.code === 11000) {
        next(
          new ErrorHandler(`${error.keyValue.email} is already exist.`, 400)
        );
      }
      next(new ErrorHandler(error, 400));
    }
  });
});

