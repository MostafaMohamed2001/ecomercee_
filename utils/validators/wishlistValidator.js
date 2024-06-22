const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleWare = require("../../middlewares/validatorMiddleware");
const Product = require("./../../models/productModel");
const User = require("./../../models/userModel");


exports.removeWishValidator = [
  check("productId").isMongoId().withMessage("Invalid Product id format")
    .custom(async(val, { req }) => {
      // check ownership before remove
      if(req.user.role === 'user'){
      const user = await User.findById(req.user._id) 
      if(req.user._id === user.wishlist[0]){
      return User.findOne({ wishlist: req.params.productId }).then((wish) => {
        if (!wish) {
          return Promise.reject(new Error("No  Product Id  not found in wishlist"));
        }
      }).catch((err) => {
        return Promise.reject(new Error("You are not authorized to remove this product from wishlist"));
      })
      }
    }
    //   else {
    //     return Promise.reject(new Error("You are not authorized to remove this product from wishlist"));
    // }
    }),
  

  validatorMiddleWare,
];

