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

// Add new category page
router.get("/new", (req, res, next) => {
  res.render("categories/new");
});

// Submit new category from form
router.post(
  "/new",
  catchAsync(async (req, res, next) => {
    const category = new Category({
      ...req.body.category,
    });
    await category.save();
    res.redirect("/categories");
  })
);

// Get edit category form
router.get(
  "/:id/edit",
  catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    res.render("categories/edit", { category });
  })
);

// Put edited values into database
router.put(
  "/:id/edit",
  catchAsync(async (req, res, next) => {
    const editedCategory = { ...req.body.category, id: req.params.id };

    // Update category
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      editedCategory
    );
    res.redirect(`/categories/${req.params.id}`);
  })
);

// Get category delete confirmation page
router.get(
  "/:id/delete",
  catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    // Get products with that category
    const products = await Product.find({ category: category._id });
    res.render("categories/delete", { category, products });
  })
);

// Delete category from database
router.delete(
  "/:id/delete",
  catchAsync(async (req, res, next) => {
    // Find and delete category
    const category = await Category.findByIdAndDelete(req.params.id);
    console.log(category);

    // Delete all products that have that category
    const products = await Product.deleteMany({ category: category._id });
    console.log(products);
    res.redirect("/categories");
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
