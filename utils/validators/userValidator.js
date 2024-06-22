const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleware");
const User = require("./../../models/userModel");
const bcrypt = require("bcryptjs");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),

  validatorMiddleWare,
];

exports.createUserValidator = [
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
  check("profileImage").optional(),
  check("role").optional(),
  check("phone")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number"),

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

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid Email")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject("Email already exists");
        }
      })
    ),
  check("profileImage").optional(),
  check("role").optional(),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number"),
  validatorMiddleWare,
];
exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),

  validatorMiddleWare,
];
exports.changePasswordValidator = [
 
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("User not found");
      }
      const isCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrect) {
        throw new Error("Incorrect current password");
      }

      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage(" passwordConfirm is required"),
  check("password")
    .notEmpty()
    .withMessage(" password is required")
    .custom((val, { req }) => {
      if (val!== req.body.passwordConfirm) {
        throw new Error(" password and password confirm ");
      }
      return true;
    })
    ,

  validatorMiddleWare,
];
