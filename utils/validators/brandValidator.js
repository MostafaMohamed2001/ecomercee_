const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleware");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),

  validatorMiddleWare,
];

exports.createBrandValidator = [
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
    check("category").isMongoId().withMessage("Invalid Category id"),
  validatorMiddleWare,
];
exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleWare,
];
exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),

  validatorMiddleWare,
];
