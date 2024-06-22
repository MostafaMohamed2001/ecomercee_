
const factory = require('./handlerFactory')
const Coupon = require("../models/copounModel");





//@desc Get list of brands
//@route GET /api/v1/brands
//@access Private / Admin ,Manger

exports.getAllCoupons = factory.getAll(Coupon)


//@desc Get specific Coupon by id
//@route GET /api/v1/coupons/:id
//@access Private / Admin ,Manger

exports.getCoupon = factory.getOne(Coupon)

//@desc Create Coupon
//@route POST /api/v1/coupons/
//@access Private / Admin ,Manger
exports.createCoupon = factory.createOne(Coupon);

//@desc Update specific Coupon by id
//@route PUT /api/v1/coupons/:id
//@access Private / Admin ,Manger
exports.updateCoupon = factory.updateOne(Coupon);

//@desc Delete specific Coupon by id
//@route Delete /api/v1/coupons/:id
//@access Private / Admin ,Manger
exports.deleteCoupon = factory.deleteOne(Coupon);
//@desc DEL list of Coupons
//@route GET /api/v1/coupons
//@access Private / Admin , Manger

exports.deleteAllcoupons =factory.deleteAll(Coupon)