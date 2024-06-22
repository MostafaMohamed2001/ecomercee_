const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema(
  {
  name: {
    type: String, 
      trim: true,
      required: [true, 'Copoun name required'],
      unique:true
  },
    expire: {
      type: Date,
      required:[true , 'Copoun expire time required']
    },
    disscount: {
      type: Number,
      required:[true , 'Coupon disscount are required']
    }
},
{timestamps: true}
);
const CouponModel = mongoose.model('Coupon', couponSchema) 
module.exports = CouponModel;  