const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true , `Order must belong to user`],
  },
  cartItems: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref:'Product',
      },
      quantity: Number,
      color: String,
      price:Number
    }
  ],
  taxPrice: {
    type: Number,
    default: 0
  },
  shippingPrice: {
    type: Number,
    default: 0
  },
  shippingAddress: {
    details: String,
    phone: Number,
    city: String,
    postalCode: String
  },
  totalOrderPrice: {
    type: Number,
    required: [true , `Order must have total price`]
  },
  paymentMethodType: {
    type: String,
    enum: ['card', 'cash'],
    default: 'cash'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: Date,
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt:Date,
},
  {
  timestamps:true
  })


orderSchema.pre(/^find/, function (next) {
    this.populate({
      path: 'user',
      select: 'name email profileImg phone'
    }).populate({
      path: 'cartItems.product',
      select: 'title imageCover'
    })
    next();
  })
  module.exports = mongoose.model('Order' , orderSchema)