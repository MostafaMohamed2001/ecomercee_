const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleware");
const Review = require("./../../models/reviewModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),

  validatorMiddleWare,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage(`you must enter rating for product`)
    .isFloat({ min: 1, max: 5 })
    .withMessage(`Rating Must between 1 to 5`),
  check("user").isMongoId().withMessage(`Invalid User id`),
  check("product")
    .isMongoId()
    .withMessage(`Invalid product id`)
    .custom((val, { req }) =>
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("You have already created a review for this product")
            );
          }
        }
      )
    ),

  validatorMiddleWare,
];
exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) => 
       Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`There is no review with id ${val}`));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`You are not allowed to perform this action`)
          ); 
        }
      })
    ),

  validatorMiddleWare,
]; 
exports.deleteReviewValidator = [
  check("id")
  .isMongoId()
  .withMessage("Invalid Review id format")

  .custom((val, { req }) => {

    // check ownership before update

    if (req.user.role === "user") {

     return Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(
            new Error(`Ther Is No review with this id ${val}`)
          );
        }
      
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`You are not allowed to perform this action`)
          ); 
        }
     });
    
    }
  
  }),



  validatorMiddleWare,
];
