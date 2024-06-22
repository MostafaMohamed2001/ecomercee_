const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const ApiError = require("./../utils/apiError");
const createToken = require("./../utils/createToken");
const sendEmail = require('../utils/sendEmail');



exports.sighup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name: name,
    email: email,
    password: password,
  });
  const token = createToken(user._id);
    // Delete password from response
  delete user._doc.password;
  res.status(201).json({
    data: user,
    token: token,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  // 2) check if user exist & check if password is correct
  const user = await User.findOne({ email: req.body.email });
  
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('Incorrect email or password', 401));
    
  }
  // 3) generate token
  const token = createToken(user._id);

  // Delete password from response
  delete user._doc.password;
  // 4) send response to client side
  res.status(200).json({ data: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  // 1
  
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(" out hello from barere")
  // console.log(req.headers)
  // console.log(token);
  if (!token  || token === 'null') {
    return next(
      new ApiError(
        `Your not login , please login to get access this route`,
        401
      )
    );
  }
  //2 

    var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
    
 
 
  // console.log(decoded);

  //3
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        `The user that belong this token doeas not longer exists`,
        401
      )
    );
  }

  //4
 
  if (currentUser.changePasswordAt) {
    let timeToMilli = parseInt(
      currentUser.changePasswordAt.getTime() / 1000,
      10
    );
  if (timeToMilli > decoded.iat) {
    return next(
      new ApiError(`Your password is changed , please login again .. `, 401)
    );
  }
}
  req.user = currentUser;
  next();
});

exports.allowTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('You are not allowed to access this route', 403)
      );
    }
    next();
  });


exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`No User found with this email ${req.body.email}`))
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(resetCode)
  const hashResetCode = crypto.createHash('sha256').update(resetCode).digest('hex')
  console.log(hashResetCode)
  user.passwordResetCode = hashResetCode;
  user.passwordResetExpire = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset code (valid for 10 min)',
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpire = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    console.log(err)
    return next(new ApiError('There is an error in sending email', 500));
  }

  res
    .status(200)
    .json({ status: 'Success', message: 'Reset code sent to email' });
})
  
exports.verifyResetPassword = asyncHandler(async (req, res, next) => { 
  const hashResetCode = crypto.createHash('sha256').update(req.body.resetCode).digest('hex')

  const user = await User.findOne({
    passwordResetCode: hashResetCode,
    passwordResetExpire : {$gte:Date.now()}
  })
  if (!user) {
    return next(new ApiError(' reset code invalid or expired reset code', 400));
  }
  user.passwordResetVerified = true;

  await user.save();
  res.status(200).json({
    status:'success'
  })
})
exports.resetPassword = asyncHandler(async (req, res, next) => {
 

  const user = await User.findOne({
    email: req.body.email
  })
  if (!user) {
    return next(new ApiError(`There is no email with this email ${req.body.email}`, 400));
  }
  if (!user.passwordResetVerified) {
    return next(new ApiError(`Reset code not verfied`, 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpire = undefined;
  user.passwordResetVerified = undefined;


  await user.save();
  delete user._doc.password;
  const token = createToken(user._id);
  res.status(201).json({
    data: user,
    token: token,
  });
});
