const express = require("express");
const {
  addProductToCart,
  getLoggedUserCart,
  removeProdFromcart,
  clearCart,
  updateItemQuantitny,
  applyCoupon
} = require("../services/cartService");

const { protect, allowTo } = require("../services/authService");

const router = express.Router();
router.use(protect, allowTo("user"));
router
  .route("/")
  .get(getLoggedUserCart)
  .post(addProductToCart)
 
  .delete(clearCart)
router.put('/applyCoupon' , applyCoupon)
  router.route('/:itemId').put(updateItemQuantitny) .delete(removeProdFromcart )

module.exports = router;
