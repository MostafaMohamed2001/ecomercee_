const express = require("express");
const {
  getAllSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  deleteAllSubCategory,
  setCategoryIdToBody,
  uploadImageCategory,
  resizeImage,
} = require("./../services/subCategoryService");
const {
  getCategoryValidator,
  createCategorValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("./../utils/validators/subCategoryValidator");
const { protect, allowTo } = require("../services/authService");
const router = express.Router({mergeParams:true});


router
  .route("/")
  .get(getAllSubCategories)
  .post(
    protect,
    allowTo("admin", "manager"),
    setCategoryIdToBody,
    uploadImageCategory,
    resizeImage,
    createCategorValidator,
    createSubCategory
  )
  .delete(deleteAllSubCategory);
router
  .route("/:id")
  .get(getCategoryValidator, getSubCategory)
  .put(
    protect,
    allowTo("admin", "manager"),
    uploadImageCategory,
    resizeImage,
    updateCategoryValidator,
    updateSubCategory
  )
  .delete(
    protect,
    allowTo("admin"),
    deleteCategoryValidator,
    deleteSubCategory
  );
module.exports = router;
