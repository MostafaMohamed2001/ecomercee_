const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { Result } = require("express-validator");


exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  )
  await user.save();
  res.status(200).json({
    status:'success',
    data: {
      id:user.id,
      user: user.name,
      wishlist: user.wishlist,
      
    },
  });
});
exports.  removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  )
  res.status(200).json({
    status: 'success',
    message:'Product removed succesfuly from wishlist',
    data: {
      id:user.id,
      user: user.name,
      wishlist: user.wishlist,
      
    },
  });
});

exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    select:("title price ratingsAverage")
  })
  // console.log("Hi")
  res.status(200).json({
    status: 'success',
    Results: user.wishlist.length,
    userId:user._id,
    data:user.wishlist
  });
});
