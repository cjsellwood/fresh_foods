const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const catchAsync = require("../utils/catchAsync");

// Products page
router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const products = await Product.find({}).populate("category");
    res.render("products/index", { products });
  })
);

// Single product page
router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate("category");
    res.render("products/show", { product });
  })
);

module.exports = router;
