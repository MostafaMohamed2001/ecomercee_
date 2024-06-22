const express = require("express");

const { sighup, login, protect , forgotPassword ,verifyResetPassword,resetPassword ,getLoggedUserData ,getOne } = require("../services/authService");

const {
  loginValidator,
  signupValidator,
  forgotPasswordValidator,
  
  
} = require("./../utils/validators/authValidator");

const router = express.Router();

router.post("/signup", signupValidator, sighup);
router.post("/login", loginValidator, login);
router.post('/forgotPassword' , forgotPasswordValidator,forgotPassword)
router.post('/verifyresetpassword' ,verifyResetPassword)
router.post('/resetpassword', resetPassword);


module.exports = router;
