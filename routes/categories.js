const express = require("express");
const router = express.Router();
const Category = require("../models/category");
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
    res.render("categories", { categories });
  })
);

module.exports = router;
