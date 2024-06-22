const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema(
  {
  name: {
    type: String, 
    required: [true, 'You Must Enter Category Name'],
    unique: [true, 'Category Must be unique'],
    minlength: [3, 'Too short Category name'],
    maxlength: [32 , 'Too long category name']
  },
  slug: {
    type: String,
    lowercase:true
    },
  image:String,
},
{timestamps: true}
);

categorySchema.post('save', (doc) => {
  if (doc.image) {
    const imgUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imgUrl;
  }
})
categorySchema.post('init', (doc) => {
  if (doc.image) {
    const imgUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imgUrl;
  }
})
const CategoryModel = mongoose.model('Category', categorySchema) 
module.exports = CategoryModel;