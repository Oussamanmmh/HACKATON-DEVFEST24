// services/cartService.js

const Product = require('../models/Product');

// Check stock availability for each item in the cart
exports.checkStockAvailability = async (items) => {
  for (let item of items) {
    const product = await Product.findById(item.productId);
    if (!product || product.stock < item.quantity) {
      return false;  // Stock is insufficient
    }
  }
  return true;  // All items have sufficient stock
};

// Calculate the total price of all items in the cart
exports.calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.quantity * item.price, 0);
};
