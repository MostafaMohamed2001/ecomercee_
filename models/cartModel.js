const mongoose = require('mongoose');
const ApiError = require('./../utils/apiError');

const cartSchema = new mongoose.Schema({
  cartItems: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        default:1
      },
      color: String,
      price:Number
  }
  ],
  totalCartPrice: Number,
  totalPriceAfterDiscount: Number,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  }
 
},
  {
  timestamps: true,
  })

  module.exports = mongoose.model('Cart' , cartSchema)