const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleware");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory id format"),

  validatorMiddleWare,
];

exports.createCategorValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory required")
    .isLength({ min: 3 })
    .withMessage("Too short subCategory name")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name")
      .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),
  validatorMiddleWare,
];
exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory id format"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleWare,
];
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCcategory id format"),
  validatorMiddleWare,
];
