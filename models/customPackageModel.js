const mongoose = require('mongoose');

const customPackageSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['honeymoon', 'yoga', 'eco', 'spiritual'],
      required: true
    },
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CustomPackage', customPackageSchema);
