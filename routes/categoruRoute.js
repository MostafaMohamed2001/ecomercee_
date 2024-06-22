const express = require("express");
const {
  createCategory,
  getAllCategories,
  deleteAll,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadImageCategory,
  resizeImage,
} = require("../services/categoryService");
const { protect, allowTo } = require("../services/authService");
const {
  getCategoryValidator,
  createCategorValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("./../utils/validators/categoryValidator");
const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRoute);
router
  .route("/")
  .get(getAllCategories)
  .post(
   
    
    protect,
    allowTo("admin", "manager"),
    uploadImageCategory,
    resizeImage,
    createCategorValidator,
    createCategory,
  
  )
  .delete(protect , allowTo('admin'),deleteAll);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    protect,
    allowTo("admin", "manager"),
    uploadImageCategory,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(protect, allowTo("admin"), deleteCategoryValidator, deleteCategory);

module.exports = router;
