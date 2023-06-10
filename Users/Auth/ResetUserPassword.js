const ErrorHandler = require("../../utils/ErrorHandler");
const AsyncFunc = require("../../utils/AsyncFunc");
const UserModel = require("../Model/UserModel");
const UserPasswordTokenModel = require("../Model/UserPasswordToken");
const { Send_mail } = require("../../utils/Send_mail");
const crypto = require("crypto");
const logger = require("../../utils/Logger");

const IsValidToken = async (user_id) => {
  try {
    const current_date = new Date().toISOString();
    const IsexpiredDocument = await UserPasswordTokenModel.find({
      user: user_id,
      expiresAt: { $lt: current_date },
    });
    if (IsexpiredDocument.length > 0) {
      await UserPasswordTokenModel.findByIdAndDelete(IsexpiredDocument[0]._id);
      return false;
    }
    return true;
  } catch (error) {
    logger.error(error);
  }
};

const createPasswordToken = async (userId) => {
  try {
    const token = crypto.randomUUID();
    const doc = await UserPasswordTokenModel.create({
      user: userId,
      token: token,
    });
    return doc;
  } catch (error) {
    throw new ErrorHandler(error, 400);
  }
};

exports.UserPasswordReset = AsyncFunc(async (req, res, next) => {
  const { current_email } = req.body;
  const IsUserExist = await UserModel.find({
    _id: req.user_id,
    email: current_email,
  });
  if (IsUserExist.length === 0) {
    return res
      .status(400)
      .json({ error: `Sorry,$${current_email} does not found.` });
  }

  const IstokenGenerated = await UserPasswordTokenModel.find({
    user: req.user_id,
  });

  if (IstokenGenerated.length > 0) {
    const IsTokenValid = await IsValidToken(req.user_id);
    return IsTokenValid
      ? res.status(400).json({
          error: `Password reset link has been already send to your email.`,
        })
      : res.status(400).json({ error: "Sorry, your token has been expired." });
  }

  const doc = await createPasswordToken(req.user_id);


  const link = `${req.headers.origin}/v2/auth/user/change/password/link/verify/${doc.user}/${doc.token}`;


  const user = {
    name: req.name,
    email: IsUserExist[0].email,
    link,
  };

  const subject = "Password reset request";
  const { info, error } = await Send_mail(user, subject);

  if (error) return next(new ErrorHandler(error.message, 400));
  return res.status(200).json({
    data: `Reset password link has been send to your email ${IsUserExist[0].email}`,
  });
});
