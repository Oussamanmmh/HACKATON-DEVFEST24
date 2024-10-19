// controllers/productController.js
const Product = require("../models/ProductModel");

// Increment the produced product count if no warnings
exports.incrementProductCount = async (warnings) => {
  try {
    if (warnings.length === 0) {
      // Find the document that holds the total product count
      let productData = await Product.findOne();

      if (!productData) {
        // Create a new record if it doesn't exist
        productData = new Product({ totalProduced: 0 });
      }

      // Increment the count
      productData.totalProduced += 1;
      await productData.save();

      console.log(
        "Product produced successfully, new total:",
        productData.totalProduced
      );
    }
  } catch (error) {
    console.error("Error incrementing product count:", error);
  }
};

// Get the total number of products produced
exports.getProducedCount = async (req, res) => {
  try {
    const productData = await Product.findOne();

    if (!productData) {
      return res.status(200).json({ totalProduced: 0 });
    }

    return res.status(200).json({ totalProduced: productData.totalProduced });
  } catch (error) {
    console.error("Error retrieving product count:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
