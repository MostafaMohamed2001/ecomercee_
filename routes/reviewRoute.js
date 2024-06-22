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
router.use(protect);
router.get('/my-reviews',allowTo('user'),getLoggedUserReviews);
router
  .route("/")
  .get(createFilterObj,getAllReviews)
  .post(allowTo("user"),setProductIdToBody,createReviewValidator, createReview)
  .delete(allowTo("admin"), deleteAllReviews);

router
  .route("/:id")
  .get(getReview)
  .put(allowTo("user"), updateReviewValidator,updateReview)
  .delete(allowTo("user", "admin", "manager"),deleteReviewValidator,deleteReview);

module.exports = router;
