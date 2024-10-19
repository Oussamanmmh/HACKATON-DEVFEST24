// models/productModel.js
const mongoose = require('mongoose');

// Simple model to count produced products
const productSchema = new mongoose.Schema({
  totalProduced: { type: Number, default: 0 }, // The total number of products produced
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
