const express = require("express");
const {
  getAllCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteAllcoupons,
  deleteCoupon,
} = require("../services/couponService");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("./../utils/validators/brandValidator");
const { protect, allowTo } = require("../services/authService");

const router = express.Router();
router.use(protect, allowTo("admin", "manager"));
router
  .route("/")
  .get(getAllCoupons)
  .post(createCoupon)
  .delete(deleteAllcoupons);

router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
