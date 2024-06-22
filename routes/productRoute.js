const express = require("express");
const {
  getProduct,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
  resizeProductImages,
  uploadProductImages,
} = require("../services/productService");
const { protect, allowTo } = require("../services/authService");

const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("./../utils/validators/productValidator");
const reviewRoute = require('./reviewRoute')
const router = express.Router();
router.use('/:productId/reviews' , reviewRoute)
router
  .route("/")
  .get(getAllProducts)
  .post(
    protect, allowTo("admin", "manager"), 
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  )
  .delete(deleteAllProducts);

router
  .route("/:id")
  .get(getProductValidator,getProduct)
  .put(
    protect,
    allowTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(protect, allowTo("admin"), deleteProductValidator, deleteProduct);

module.exports = router;
