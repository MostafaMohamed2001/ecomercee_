const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Too Short product title"],
    maxlength:[100,'Too long product title']
  },
  slug: {
    type: String,
    required: true,
    lowercase:true
  },
  description: {
    type: String,
    required: true,
    minlength: [20, "Too Short product description"],
  },
  quantity: {
    type: Number,
    required: [true,"Product quantity is required"]
  },
  sold: {
    type: Number,
    default:0,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    trim: true,
    max: [2000000, "Too long product price"],
  },
  priceAfterDisscount: {
    type:Number,
  },
  colors: [String],
  imageCover: {
    type: String,
    required:[true,"Product image cover is required"]
  },
  images: [String],
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required:[true,"Product must belong to category"]
  },
  subcategories:[ {
    type: mongoose.Schema.ObjectId,
    ref: "SubCategory",
  }],
  brand: {
    type: mongoose.Schema.ObjectId,
    ref: "Brand",
  },
  ratingsAverage: {
    type: Number,
    min:[1,"rating must above or equal 1.0"],
    max:[5,"rating must below or equal 5.0"],
  },
  ratingsQuantity: {
    type: Number,
    default:0
  }
},
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject:{virtuals:true}
  },
);

const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imgUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imgUrl;
  }
  let images = [];
  if (doc.images) {
    doc.images.forEach((img) => {
      const imgUrl = `${process.env.BASE_URL}/products/${img}`;
      images.push(imgUrl)
    })
    doc.images = images;
  }
}
productSchema.post('init', (doc) => {
  setImageUrl(doc)
})
productSchema.post('save', (doc) => {
  setImageUrl(doc)
})
productSchema.virtual('reviews', {

  ref: 'Review',

  foreignField: 'product',

  localField:'_id'
  
})



module.exports = mongoose.model('Product', productSchema);