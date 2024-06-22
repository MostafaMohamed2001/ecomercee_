const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const factory = require('./handlerFactory')
const ApiError = require("./../utils/apiError");
const SubCategory = require("../models/subCategoryModel");

const {uploadSingleImage} = require('../middlewares/uploadImageMiddleware')
const { v4:uuidv4} = require('uuid')

const sharp = require("sharp");
//@ Set Category Id to body
exports.setCategoryIdToBody = (req, res, next) => {
  
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
}



  exports.uploadImageCategory = uploadSingleImage('image')


exports.resizeImage =asyncHandler( async(req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`)
    req.body.image = filename;
  }
  next()
  })

//@desc Get list of subCategories
//@route GET /api/v1/subcategories
//@access Public

exports.getAllSubCategories = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  let filterObj = {}
  if(req.params.categoryId) filterObj = {category:req.params.categoryId}
  const subCategories = await SubCategory.find(filterObj).skip(skip).limit(limit);

  res.status(200).json({
    result: subCategories.length,
    data: subCategories,
  });
});

//@desc Get specific subCategory by id
//@route GET /api/v1/subcategories/:id
//@access Public

exports.getSubCategory = factory.getOne(SubCategory)

//@desc Create subCategory
//@route POST /api/v1/subcategories/
//@access Private / Admin ,Manger
exports.createSubCategory =factory.createOne(SubCategory)

//@desc Update specific subCategory by id
//@route PUT /api/v1/subcategories/:id
//@access Private / Admin ,Manger
exports.updateSubCategory = factory.updateOne(SubCategory);

//@desc Delete specific Subcategory by id
//@route Delete /api/v1/subcategories/:id
//@access Private / Admin 
exports.deleteSubCategory = factory.deleteOne(SubCategory)
//@desc DEL list of subCategory
//@route GET /api/v1/subcategories
//@access Private / Admin 

exports.deleteAllSubCategory = factory.deleteAll(SubCategory)


