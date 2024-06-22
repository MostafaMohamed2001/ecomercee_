const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const factory = require('./handlerFactory')
const ApiError = require('./../utils/apiError');
const Brand = require("../models/brandModel");
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
    .toFile(`uploads/brands/${filename}`)
    req.body.image = filename;
    
  }
  next()
  })

 



//@desc Get list of brands
//@route GET /api/v1/brands
//@access Public

exports.getAllBrands = factory.getAll(Brand)


//@desc Get specific brand by id
//@route GET /api/v1/brands/:id
//@access Public

exports.getBrand = factory.getOne(Brand)

//@desc Create Brand
//@route POST /api/v1/brands/
//@access Private / Admin ,Manger
exports.createBrand = factory.createOne(Brand);

//@desc Update specific brand by id
//@route PUT /api/v1/brands/:id
//@access Private / Admin ,Manger
exports.updateBrand = factory.updateOne(Brand);

//@desc Delete specific brand by id
//@route Delete /api/v1/brands/:id
//@access Private / Admin 
exports.deleteBrand = factory.deleteOne(Brand);
//@desc DEL list of brands
//@route GET /api/v1/brands
//@access Private / Admin 

exports.deleteAllbrands =factory.deleteAll(Brand)