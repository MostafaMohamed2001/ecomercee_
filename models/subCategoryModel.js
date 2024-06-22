const mongoose = require('mongoose');
const subCategorySchema = new mongoose.Schema(
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
    image: String,
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required:[true , 'subCategory must be belong to parent category']
  }
},
{timestamps: true}
);


subCategorySchema.post('save', (doc) => {
  if (doc.image) {
    const imgUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imgUrl;
  }
})
subCategorySchema.post('init', (doc) => {
  if (doc.image) {
    const imgUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imgUrl;
  }
})
const CategoryModel = mongoose.model('subCategory', subCategorySchema) 
module.exports = CategoryModel;