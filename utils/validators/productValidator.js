const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleware");
const Category = require("./../../models/categoryModel");
const SubCategory = require("./../../models/subCategoryModel");
const Brand = require("./../../models/brandModel");
exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product Required")
    .isLength({ max: 100 })
    .withMessage("Too long product title")
    .isLength({ min: 3 })
    .withMessage("Too short product title")
    .trim()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
   
  check("description")
    .notEmpty()
    .withMessage("Product description Required")
    .isLength({ min: 20 })
    .withMessage("Too short product description ")
    .trim(),
  check("quantity")
    .isNumeric()
    .withMessage("Product quantity must be a number")
    .notEmpty()
    .withMessage("Product quantity Required"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),
  check("price")
    .isNumeric()
    .withMessage("Product price must be a number")
    .notEmpty()
    .withMessage("Product price Required")
    .isLength({ max: 32 })
    .withMessage("Too long product price"),
  check("priceAfterDisscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product priceAfterDisscount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("price aftre disscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("brand").optional().isMongoId().withMessage("Invalid ID formate")
    .custom(async (val) => {
      const brand = await Brand.findById(val);
      if (!brand) {
        return Promise.reject(new Error(`No brand found with id => ${val}`));
      } 
    }),
  check("category")
    .isMongoId() 
    .withMessage("Invalid ID formate")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .custom(async (val) => {
      const category = await Category.findById(val);
      if (!category) {
        return Promise.reject(new Error(`No category found with id => ${val}`));
      }
    }),

  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid SubCategory format")
    .custom(
      async (subcategoriesIds) =>
        await SubCategory.find({
          _id: { $exists: true, $in: subcategoriesIds },
        }).then((result) => {
          // when i insert on id he doesn't return me id in array he retun length of id is 24  (this happen when i insert one only) so that i insert it on array
          // but when i insert two he retun array has two id's with length -- 2 -- that mean this problem happen when i insert one only
          if (subcategoriesIds.length === 24) {
            subcategoriesIds = [subcategoriesIds];
          }
          // console.log(subcategoriesIds);
          if (result.length < 1 || result.length !== subcategoriesIds.length) {
            return Promise.reject(new Error(`Invalid subcategories Ids`));
          }
        })
    )
    .custom(async (val, { req }) => {
      const subCategories = await SubCategory.find({
        category: req.body.category,
      });
      if (val.length === 24) {
        val = [val];
      }
      const subId = [];
      subCategories.forEach((val) => {
        subId.push(val._id.toString());
      });
      // console.log(subId);
      // const checker = val.every((v) => subId.includes(v));
      const checker = (targetVal, checkVal) =>
        targetVal.every((v) => checkVal.includes(v));
      if (!checker(val, subId)) {
        return Promise.reject(
          new Error(`Subcategories Must belong to category`)
        );
      }
    }),

  
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric() 
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleWare,
];
exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleWare,
];

exports.updateProductValidator = [
  check("title")
  .optional()
  .isLength({ max: 100 })
  .withMessage("Too long product title")
  .isLength({ min: 3 })
  .withMessage("Too short product title")
  .trim()
  .custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
check("description")
  .optional()
  .isLength({ min: 20 })
  .withMessage("Too short product description ")
  .trim(),
check("quantity")
  .isNumeric()
  .withMessage("Product quantity must be a number")
 .optional(),
check("sold")
  .optional()
  .isNumeric()
  .withMessage("Product sold must be a number"),
check("price")
  .isNumeric()
  .withMessage("Product price must be a number")
  .optional()   
  .isLength({ max: 32 })
  .withMessage("Too long product price"),
check("priceAfterDisscount")
  .optional()
  .toFloat()
  .isNumeric()
  .withMessage("Product priceAfterDisscount must be a number")
  .custom((value, { req }) => {
    if (req.body.price <= value) {
      throw new Error("price aftre disscount must be lower than price");
    }
    return true;
  }),
check("colors")
  .optional()
  .isArray()
  .withMessage("availableColors should be array of string"),
check("imageCover").optional(),
check("images")
  .optional()
,
check("category")
  .isMongoId()
  .optional()
  .withMessage("Product must be belong to a category")
  .custom(async (val) => {
    const category = await Category.findById(val);
    if (!category) {
      return Promise.reject(new Error(`No category found with id => ${val}`));
    }
  }),

check("subcategories")
  .optional()
  .isMongoId()
  .withMessage("Invalid SubCategory format")
  .custom(
    async (subcategoriesIds) =>
      await SubCategory.find({
        _id: { $exists: true, $in: subcategoriesIds },
      }).then((result) => {
        // when i insert on id he doesn't return me id in array he retun length of id is 24  (this happen when i insert one only) so that i insert it on array
        // but when i insert two he retun array has two id's with length -- 2 -- that mean this problem happen when i insert one only
        if (subcategoriesIds.length === 24) {
          subcategoriesIds = [subcategoriesIds];
        }
        // console.log(subcategoriesIds);
        if (result.length < 1 || result.length !== subcategoriesIds.length) {
          return Promise.reject(new Error(`Invalid subcategories Ids`));
        }
      })
  )
  .custom(async (val, { req }) => {
    const subCategories = await SubCategory.find({
      category: req.body.category,
    });
    if (val.length === 24) {
      val = [val];
    }
    const subId = [];
    subCategories.forEach((val) => {
      subId.push(val._id.toString());
    });
    // console.log(subId);
    // const checker = val.every((v) => subId.includes(v));
    const checker = (targetVal, checkVal) =>
      targetVal.every((v) => checkVal.includes(v));
    if (!checker(val, subId)) {
      return Promise.reject(
        new Error(`Subcategories Must belong to category`)
      );
    }
  }),

  check("brand").optional().isMongoId().withMessage("Invalid ID formate")
    .custom(async (val) => {
      const brand = await Brand.findById(val);
      if (!brand) {
        return Promise.reject(new Error(`No brand found with id => ${val}`));
      } 
    }),
check("ratingsAverage")
  .optional()
  .isNumeric()
  .withMessage("ratingsAverage must be a number")
  .isLength({ min: 1 })
  .withMessage("Rating must be above or equal 1.0")
  .isLength({ max: 5 })
  .withMessage("Rating must be below or equal 5.0"),
check("ratingsQuantity")
  .optional()
  .isNumeric()
  .withMessage("ratingsQuantity must be a number"),


  validatorMiddleWare,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleWare,
];
