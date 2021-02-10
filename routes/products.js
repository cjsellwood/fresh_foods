const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const catchAsync = require("../utils/catchAsync");

// Products page
router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const products = await Product.find({}).populate("category");
    res.render("products", { products });
  })
);

module.exports = router;
