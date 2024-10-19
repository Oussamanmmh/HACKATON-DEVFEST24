// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Route to get the total number of products produced
router.get("/products/count", productController.getProducedCount);

module.exports = router;
