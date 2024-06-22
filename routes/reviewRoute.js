const express = require("express");
const {
  getReview,
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  deleteAllReviews,
  createFilterObj,
  setProductIdToBody,
  getLoggedUserReviews
} = require("../services/reviewService");
const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator
} = require("./../utils/validators/reviewValidator");
const { protect, allowTo } = require("../services/authService");
const router = express.Router({mergeParams:true});

router.get('/my-reviews',allowTo('user'),getLoggedUserReviews);
router
  .route("/")
  .get(createFilterObj,getAllReviews)
  .post(protect,allowTo("user"),setProductIdToBody,createReviewValidator, createReview)
  .delete(protect,allowTo("admin"), deleteAllReviews);

router
  .route("/:id")
  .get(getReview)
  .put(protect,allowTo("user"), updateReviewValidator,updateReview)
  .delete(protect,allowTo("user", "admin", "manager"),deleteReviewValidator,deleteReview);

module.exports = router;
