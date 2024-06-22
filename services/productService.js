
const asyncHandler = require("express-async-handler");

const factory = require("./handlerFactory");
const Product = require("../models/productModel");
const ApiError = require('./../utils/apiError');

const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');
const { v4: uuidv4 } = require("uuid");

const sharp = require("sharp");



exports.uploadProductImages = uploadMixOfImages([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 5,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    console.log("emagggessssss cover")
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  
  //2- Image processing for images
  if (req.files.images) {
    console.log("emagggessssss")
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );


   
  }
  next();
});
// exports.resizeImage =asyncHandler( async(req, res, next) => {
//   const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
//   await sharp(req.file.buffer)
//     .resize(600, 600)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`uploads/categories/${filename}`)
//   req.body.image = filename;
//   next()
//   })

//@desc Get list of products
//@route GET /api/v1/products
//@access Public

exports.getAllProducts = factory.getAll(Product);

//@desc Get specific product by id
//@route GET /api/v1/products/:id
//@access Public

exports.getProduct = factory.getOne(Product ,'reviews')


//@desc Create Product
//@route POST /api/v1/products/
//@access Private / Admin ,Manger
exports.createProduct = factory.createOne(Product);

//@desc Update specific product by id
//@route PUT /api/v1/products/:id
//@access Private / Admin ,Manger
exports.updateProduct = factory.updateOne(Product);

//@desc Delete specific product by id
//@route Delete /api/v1/products/:id
//@access Private / Admin 
exports.deleteProduct = factory.deleteOne(Product);

//@desc DEL list of products
//@route GET /api/v1/products
//@access Private / Admin

exports.deleteAllProducts = factory.deleteAll(Product);
