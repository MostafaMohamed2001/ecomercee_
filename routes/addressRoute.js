const express = require("express");
const {
  addAddress,
  removeAddress,
  getLoggedUserAddress
} = require("../services/addressService");
// const {removeWishValidator} = require("./../utils/validators/wishlistValidator");
const { protect, allowTo } = require("../services/authService");

const router = express.Router();

router.use(protect, allowTo("user"))
router
  .route("/")
  .post( addAddress).get(getLoggedUserAddress)
  

router
.route("/:addressId")
.delete(protect, allowTo("user"),removeAddress);

module.exports = router;
