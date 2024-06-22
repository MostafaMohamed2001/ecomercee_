const mongoose = require('mongoose');
const brandSchema = new mongoose.Schema(
  {
  name: {
    type: String, 
    required: [true, 'You Must Enter Brand Name'],
    unique: [true, 'Brand Must be unique'],
    minlength: [3, 'Too short Brand name'],
    maxlength: [32 , 'Too long Brand name']
  },
  slug: {
    type: String,
    lowercase:true
    },
    image: String,
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required:[true , 'Brand must be belong to parent category']
  }
},
{timestamps: true}
);
const BrandModel = mongoose.model('Brand', brandSchema) 
module.exports = BrandModel;