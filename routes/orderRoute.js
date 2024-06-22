const express = require("express");
const {
  createOrderCash,
  filterOrederForLoggedUser,
  getAllOrders,
  getSpecficOrder,
  updateOrderIsPaid,
  updateOrderIsDelivered,
  checkoutSession
} = require("../services/orderService");

const { protect, allowTo } = require("../services/authService");

const router = express.Router();
// router.get('/test', protect, allowTo('admin' , 'user'), (req,res,next) => {
//   console.log(req.user.role);
//   next()
// },(req, res, next) => {
//   res.status(200).json({ message: "Welcome to the orders API" });
// })

router.route("/:cartId").post(protect , allowTo('user'),createOrderCash);

router.get(
  "/",
  protect,
  allowTo("admin" ,"manager","user"),
  filterOrederForLoggedUser,
  getAllOrders
);
router.get(
  "/:id",
  protect,
  allowTo("user", "admin", "manager"),
  filterOrederForLoggedUser,
  getSpecficOrder
);
router.put('/:id/pay', protect, allowTo('admin', 'manager'), updateOrderIsPaid)
router.put('/:id/deliver', protect, allowTo('admin', 'manager'), updateOrderIsDelivered)

router.get('/create-checkout-session/:cartId',protect, allowTo('user'),checkoutSession)
module.exports = router;
  