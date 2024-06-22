
const asyncHandler = require("express-async-handler");
const factory = require('./handlerFactory')
const Category = require("../models/categoryModel");
const {uploadSingleImage} = require('../middlewares/uploadImageMiddleware')
const { v4:uuidv4} = require('uuid')

const sharp = require("sharp");




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
//@desc Get list of categories
//@route GET /api/v1/categories
//@access Public

exports.getAllCategories = factory.getAll(Category)

//@desc Get specific category by id
//@route GET /api/v1/categories/:id
//@access Public

exports.getCategory = factory.getOne(Category)

//@desc Create Category
//@route POST /api/v1/categories/
//@access Private
exports.createCategory = factory.createOne(Category)

//@desc Update specific category by id
//@route PUT /api/v1/categories/:id
//@access Private / Admin ,Manger
exports.updateCategory = factory.updateOne(Category)

//@desc Delete specific category by id
//@route Delete /api/v1/categories/:id
//@access Private / Admin ,Manger
exports.deleteCategory = factory.deleteOne(Category);


//@desc DEL list of categories
//@route GET /api/v1/categories
//@access Private / Admin 

exports.deleteAll = factory.deleteAll(Category);