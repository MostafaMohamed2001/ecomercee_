const asyncHandler = require("express-async-handler");

const Cart = require("./../models/cartModel");
const Product = require("./../models/productModel");
const ApiError = require('./../utils/apiError');
const Coupon = require("../models/copounModel");
const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  return totalPrice;
};

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price,
        },
      ],
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({
        product: productId,
        color,
        price: product.price,
      });
    }
  }
  const totalPrice = calcTotalCartPrice(cart);
  cart.totalCartPrice = totalPrice;
  await cart.save();
  res.status(200).json({
    status: "success",
    message: "Product added succesfuly to cart",
    data: cart,
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(200).json({
      status: "success",
      message: "No cart found",
      numberOfCartItems: 0,
      data: cart,
    });
  } else {
    res.status(200).json({
      status: "success",
      numberOfCartItems: cart.cartItems.length,
      data: cart,
    });
  }
 
});

exports.removeProdFromcart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true }
  );
  const totalPrice = calcTotalCartPrice(cart);
  cart.totalCartPrice = totalPrice;
  await cart.save();
  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });

  res.status(200).send();
});


exports.updateItemQuantitny = asyncHandler(async (req, res, next) => {
  const {quantity} = req.body
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("No cart found", 404));
  } 
  const ItemIndex = cart.cartItems.findIndex((i)=> i._id.toString() === req.params.itemId)
  if (ItemIndex > -1) {
    const cartItem = cart.cartItems[ItemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[ItemIndex] = cartItem;
  } else {
    return next(new ApiError(`Item not found in cart for this id ${req.params.id}`, 404));
   }
  const totalPrice = calcTotalCartPrice(cart);
  cart.totalCartPrice = totalPrice;
  await cart.save();
  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
})

exports.applyCoupon = asyncHandler(async (req, res, next) => {

  
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
    
  });
  if (!coupon) {
    return next(new ApiError("Coupon not valid or expired", 404));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  
  const totalPrice = cart.totalCartPrice;
  const totalPriceAfterDisscount = (totalPrice - (totalPrice * coupon.disscount) / 100).toFixed(2);
  cart.totalPriceAfterDiscount = totalPriceAfterDisscount
  await cart.save();
  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
})


