const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const Product = require("../models/product");
const catchAsync = require("../utils/catchAsync");

// Categories page
router.get(
  "/",
  catchAsync(async (req, res, next) => {
    let categories = await Category.find({});

    // Sort alphabetically
    categories = categories.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      } else {
        return 0;
      }
    });
    res.render("categories/index", { categories });
  })
);

// Single category page
router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    
    // Get products with that category
    const products = await Product.find({ category: category._id });
    res.render("categories/show", { category, products });
  })
);

module.exports = router;
