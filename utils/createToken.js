const jwt = require("jsonwebtoken");
const { sanitizeUser } = require("./../utils/sanitizeData");
const setToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
const setTokenAndCookies = (user, statusCode, res) => {
  const token = setToken(user._id);
  const cookieOptions = {
    expiresIn: process.env.JWT_EXPIRE,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  res
    .status(statusCode)
    .json({ status: "success", token, data: sanitizeUser(user) });
};
module.exports = setTokenAndCookies;