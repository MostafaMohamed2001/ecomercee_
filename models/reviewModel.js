const mongoose = require('mongoose');
const Product = require('./productModel')
const reviewSchema = new mongoose.Schema(
  {
    title: {
    type:String
    },
    ratings: {
      type: Number,
      min: [1, 'Min rating is 1.0' ],
      max: [5, 'Max rating is 5.0']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required:[true , 'Review Must Belong to user']
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required:[true , 'Review Must Belong to product']
    }
},
{timestamps: true}
);

reviewSchema.pre(/^find/, function (next) {

  this.populate({

    path: "user",
    select: 'name'
  })
  next();
});
reviewSchema.statics.calacAverageRatingsQuantity = async function (productId) {
  const res = await this.aggregate([
    {
      $match: { product: productId }
    },
    {
      $group: {
        _id: 'product',
        averageRating: { $avg: '$ratings' },
        quantity: { $sum: 1 }
      }
    }
  ]);
  if (res.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: res[0].averageRating,
      ratingsQuantity: res[0].quantity 
    })
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0 
    })
  }
  console.log(res)
}
reviewSchema.post('save', async function () {
  await this.constructor.calacAverageRatingsQuantity(this.product);
})
reviewSchema.post('remove', async function () {
  await this.constructor.calacAverageRatingsQuantity(this.product);
})
const ReviewdModel = mongoose.model('Review', reviewSchema) 
module.exports = ReviewdModel; 