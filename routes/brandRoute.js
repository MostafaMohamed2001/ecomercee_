const express = require("express");
const {
  getAllBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  deleteAllbrands,
  uploadImageCategory,
  resizeImage,
} = require("../services/brandService");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("./../utils/validators/brandValidator");
const { protect, allowTo } = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getAllBrands)
  .post(
   
    uploadImageCategory,
    resizeImage,
    createBrandValidator,
    createBrand
  )
  .delete(deleteAllbrands);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
   
    uploadImageCategory,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete( deleteBrandValidator, deleteBrand);

module.exports = router;
