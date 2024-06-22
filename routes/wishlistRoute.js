const express = require("express");
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist
} = require("../services/wishlistService");
const {removeWishValidator} = require("./../utils/validators/wishlistValidator");
const { protect, allowTo } = require("../services/authService");

const router = express.Router();

router.use(protect, allowTo("user"))
router
  .route("/")
  .post(addProductToWishlist).get(getLoggedUserWishlist)
  

router
.route("/:productId")
.delete(protect, allowTo("user"),removeProductFromWishlist);

module.exports = router;
