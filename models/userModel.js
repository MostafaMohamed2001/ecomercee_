const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImage: String,
    password: {
      type: String,
      required: [true, "password required"],
      min: [6, "Too short password"],
      max: [32, "Too long password"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
      }
    ],
    address: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode:String
      }
    ],
    changePasswordAt: Date,
    passwordResetCode: String,
    passwordResetExpire: Date,
    passwordResetVerified:Boolean,
  },

  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
})
const setImageUrl = (doc) => {
  if (doc.profileImage) {
    const imgUrl = `${process.env.BASE_URL}/users/${doc.profileImage}`;
    doc.profileImage = imgUrl;
  }
}
userSchema.post('init', (doc) => {
  setImageUrl(doc)
})
userSchema.post('save', (doc) => {
  setImageUrl(doc)
})

const User = mongoose.model('User', userSchema);
module.exports = User;