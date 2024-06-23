const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const Order = require('./../models/orderModel');
const Cart = require("./../models/cartModel");
const Product = require("./../models/productModel");
const User = require("./../models/userModel");
const factory = require('./handlerFactory')

const ApiError = require('./../utils/apiError');
const asyncHandler = require("express-async-handler");



exports.createOrderCash = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError(`Cart not found with this id ${req.params.cartId}`, 404));
  }
  const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
  const {taxPrice ,shippingPrice } = req.body
  const totalOrderPrice = (cartPrice) + parseInt(taxPrice) + parseInt(shippingPrice);
  // const totalOrderPrice = cartPrice ;
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    taxPrice,
    shippingPrice,
    totalOrderPrice,
  });
  if(order){
    var bulkOption = cart.cartItems.map((i) => ({
      updateOne: {
        filter: { _id: i.product },
        update: { $inc: { quantity: -i.quantity, sold: +i.quantity } },
      },
    }));
    }
  await Product.bulkWrite(bulkOption, {})

  await Cart.findOneAndDelete(req.params.cartId);
  res.status(201).json({ status: 'success', data: order });
})

exports.filterOrederForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'user') req.filterObj = { user: req.user._id }
  next()
})
exports.getAllOrders = factory.getAll(Order)
exports.getSpecficOrder = factory.getOne(Order)


exports.updateOrderIsPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError(`Order not found with this id ${req.params.id}`, 404));
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const updateOrder = await order.save();
  res.status(200).json({
    status: 'success',
    data: updateOrder,
  })
})
exports.updateOrderIsDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError(`Order not found with this id ${req.params.id}`, 404));
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updateOrder = await order.save();
  res.status(200).json({
    status: 'success',
    data: updateOrder,
  })
});


//@desc Get check out session from stripe and send it as response
//@route  GET /api/orders/create-checkout-session/cartId
//@access Protected /User

exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError(`Cart not found with this id ${req.params.cartId}`, 404));
  }
  const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice;
  // const {taxPrice ,shippingPrice } = req.body
  // const totalOrderPrice = (cartPrice) + parseInt(taxPrice) + parseInt(shippingPrice);
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  const session = await stripe.checkout.sessions.create({
    
    line_items: [
      {
        
        price_data: {
          currency: 'egp',
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
          }
        },
    
        quantity: 1
      }
    ],

    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress
  });
  res.status(200).json({
    status:'success',
    data: session,
  });

})

const createCartOrder = async (session) => {
  console.log("hello fron inside fun")
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  
  const user = await User.findOne({ email: session.customer_email });
  console.log(cart , user , cartId , shippingAddress , orderPrice , "Product")
  // create order
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType:'card',
  });
  if(order){
    var bulkOption = cart.cartItems.map((i) => ({
      updateOne: {
        filter: { _id: i.product },
        update: { $inc: { quantity: -i.quantity, sold: +i.quantity } },
      },
    }));
    }
  await Product.bulkWrite(bulkOption, {})

  await Cart.findByIdAndDelete(cartId);

}

exports.weebhookCheckOut = asyncHandler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECERT);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
    
  }
  if (event.type === 'checkout.session.completed') {
    console.log("hello from out side")
    createCartOrder(event.data.object)
    // console.log(event.data.object)
  
    res.status(201).json({ recieved:true });

  }
})