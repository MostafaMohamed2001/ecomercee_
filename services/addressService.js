const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { Result } = require("express-validator");


exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { address: req.body },
    },
    { new: true }
  )
  await user.save();
  res.status(200).json({
    status:'success',
    message: "Address added successfully",
   data:user.address
  });
});
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { address:{_id:req.params.addressId} },
    },
    { new: true }
  )
  await user.save();
  res.status(200).json({
    status:'success',
    message: "Address added successfully",
   data:user.address
  });
});

exports.getLoggedUserAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('address')
  
  res.status(200).json({
    status: 'success',
    Results: user.address.length,
    data:user.address
  });
});
