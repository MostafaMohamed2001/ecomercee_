
const factory = require('./handlerFactory')
const Review = require("../models/reviewModel");
const asyncHandler = require("express-async-handler");


exports.createFilterObj = (req, res, next) => {

  let filterObject = {};

  if (req.params.productId) filterObject = { product: req.params.productId };

  req.filterObj = filterObject;

  next();
};

//@ Set Product Id to body
exports.setProductIdToBody = (req,res,next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
}




//@desc Get list of reviews
//@route GET /api/v1/reviews
//@access Public

exports.getAllReviews = factory.getAll(Review)
// exports.getAllReviews = (req,res,next) => {
//   console.log("Hello")
// }


//@desc Get specific review by id
//@route GET /api/v1/reviews/:id
//@access Public

exports.getReview = factory.getOne(Review)

//@desc Create review
//@route POST /api/v1/reviews/
//@access Private / Admin ,Manger
exports.createReview = factory.createOne(Review);

//@desc Update specific review by id
//@route PUT /api/v1/reviews/:id
//@access Private / Admin ,Manger
exports.updateReview = factory.updateOne(Review);

//@desc Delete specific review by id
//@route Delete /api/v1/reviews/:id
//@access Private / Admin 
exports.deleteReview = factory.deleteOne(Review);
//@desc DEL list of reviews
//@route GET /api/v1/reviews
//@access Private / Admin 

exports.deleteAllReviews = factory.deleteAll(Review)


exports.getLoggedUserReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user._id });
  if (!reviews) {
    return next(new ApiError(`No reviews found for this user`, 404));
  }
  res.status(200).json({
    status: "success",
    data: reviews,
  });
})