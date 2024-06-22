const express = require("express");
const {
  getAllUsres,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
  uploadUserImage,
  resizeImage,
  userChangePass,
  getLoggedUserData,
  updateLoggedUserPassword,
} = require("../services/userService");
const { protect, allowTo } = require("../services/authService");
const {
  createUserValidator,
  changePasswordValidator,
  updateUserValidator,
} = require("./../utils/validators/userValidator");

const router = express.Router();
router.use(protect);
router.route("/changePass/:id").put(changePasswordValidator, userChangePass);



router
  .route("/changeMyPass")
  .put(getLoggedUserData, changePasswordValidator, updateLoggedUserPassword);
  



  
router.get("/getme", getLoggedUserData, getUser);
router.use(allowTo("admin", "manager"));
router
  .route("/")
  .get(getAllUsres)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser)
  .delete(deleteAllUsers);

router
  .route("/:id")
  .get(getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUser);
module.exports = router;
