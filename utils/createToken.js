const jwt = require("jsonwebtoken");

const setToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  
module.exports = setToken;