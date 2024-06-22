const asyncHandler = require("express-async-handler");

const factory = require('./handlerFactory')
const ApiError = require('./../utils/apiError');
const User = require("../models/userModel");
const {uploadSingleImage} = require('./../middlewares/uploadImageMiddleware')
const { v4:uuidv4} = require('uuid')
const bcrypt = require('bcryptjs')
const createToken = require("./../utils/createToken");

const sharp = require("sharp");




  exports.uploadUserImage = uploadSingleImage('profileImage')


exports.resizeImage =asyncHandler( async(req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`; 
  if(req.file){
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${filename}`)
    req.body.profileImage = filename;
  }
  next()
  })

//@desc Get list of users
//@route GET /api/v1/users
//@access Private / Admin , manger

exports.getAllUsres = factory.getAll(User)

//@desc Get specific User by id
//@route GET /api/v1/users/:id
//@access Private Admin , Manger

exports.getUser = factory.getOne(User)

//@desc Create Brand
//@route POST /api/v1/users/
//@access Private / Admin , manger
exports.createUser = factory.createOne(User);

//@desc Update specific User by id
//@route PUT /api/v1/users/:id
//@access Private Admin , Manger
exports.updateUser = asyncHandler(async (req, res, next) => {
  
  const doc = await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    slug: req.body.slug,
    phone: req.body.phone,
    email: req.body.email,
    profileImage: req.body.profileImage,  
    role: req.body.role,
  },
    {
    new:true
    })
  if (!doc) {
    return next(new ApiError(`No user foud with this id ${req.params.id}`,404))
  }
  delete doc._doc.password;
  res.status(200).json({
    data : doc
  }) 
  
})
//@desc Update specific User by id
//@route PUT /api/v1/changePass/:id
//@access Private Admin , Manger
exports.userChangePass = asyncHandler(async (req, res, next) => {
  const doc = await User.findByIdAndUpdate(req.params.id, {
   
    password: await bcrypt.hash(req.body.password, 10),
    changePasswordAt:Date.now(),
  },
    {
    new:true
    })
  if (!doc) {
    return next(new ApiError(`No user foud with this id ${req.params.id}`,404))
  }
  delete doc._doc.password;
  res.status(200).json({
    data : doc
  })
})

//@desc Delete specific User by id
//@route Delete /api/v1/users/:id
//@access Private / Admin 

exports.deleteUser = factory.deleteOne(User);
//@desc DEL list of User
//@route GET /api/v1/users
//@access Private / Admin 


exports.deleteAllUsers = factory.deleteAll(User)

// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  console.log("Hi mmmm1")
  const user = await User.findByIdAndUpdate(req.user._id, {
   
    password: await bcrypt.hash(req.body.password, 10),
    changePasswordAt:Date.now(),
  },
    {
    new:true
    })
  if (!user) {
    return next(new ApiError(`No user foud with this id ${req.params.id}`,404))
  }
  delete user._doc.password;
  const token = createToken(user._id);
  console.log("Hi mmmm")
  res.status(201).json({
    data: user,
    token: token,
  });
})