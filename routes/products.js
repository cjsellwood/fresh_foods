const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");
const catchAsync = require("../utils/catchAsync");

// Products page
router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const products = await Product.find({}).populate("category");
    res.render("products/index", { products });
  })
);

// Get new product form
router.get(
  "/new",
  catchAsync(async (req, res, next) => {
    const categories = await Category.find({});
    res.render("products/new", { categories });
  })
);

// Submit new product
router.post(
  "/new",
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    const newProduct = new Product({
      ...req.body.product
    })
    console.log(newProduct)
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`)
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
