const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleware");
const Category = require("./../../models/categoryModel");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),

  validatorMiddleWare,
];

exports.createCategorValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleWare,
];
exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleWare,
];
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),

  validatorMiddleWare,
];
