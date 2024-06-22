const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleware");
const User = require("./../../models/userModel");
const bcrypt = require("bcryptjs");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("invalid Email")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject("Email already exists");
        }
      })
    ),
  
  check("password")
    .notEmpty()
    .withMessage("Enter password")
    .isLength({ min: 6 })
    .withMessage("Too short password")
    .isLength({ max: 32 })
    .withMessage("Too longw  password")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error("not similar password and password confirm");
      }
      return true;
    }),
  check("passwordConfirm").notEmpty().withMessage("passwordConfirm required"),

  validatorMiddleWare,
];

exports.loginValidator = [

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail(),
  
  check("password")
    .notEmpty()
    .withMessage("Enter password"),
  validatorMiddleWare,
];
exports.forgotPasswordValidator = [

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
  .withMessage('Enter valid email'),
  validatorMiddleWare,
];
