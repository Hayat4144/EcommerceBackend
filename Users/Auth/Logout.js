const AsyncFunc = require("../../utils/AsyncFunc");

exports.Logout = AsyncFunc(async (req, res, next) => {
  const token =
    process.env.NODE_ENV === "production"
      ? req.cookies.token
      : req.cookies.token_dev;
  if (!token) {
    return res.status(401).json({ error: "you are unauthorized." });
  }
  return res
    .status(200)
    .clearCookie(
      process.env.NODE_ENV === "production" ? "token" : "token_dev",
      { expires: new Date(0) }
    )
    .json({ data: "Logout successful." });
});
