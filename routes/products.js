const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { productSchema } = require("../joi");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ dest: "public/images/", storage: storage });
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// Middleware for validating with Joi
const validateProduct = (req, res, next) => {
  // Validates request body based on joi schema
  const { error } = productSchema.validate(req.body);
  console.log(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

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
    // Fetch categories for dropdown select
    const categories = await Category.find({});
    res.render("products/new", { categories });
  })
);

const resizeImage = (req, res, next) => {
  console.log(req.file);
  console.log(req.params);
  const filename = `${uuidv4()}.webp`;
  req.body.product.image = filename;
  sharp(req.file.buffer)
    .resize(250, 250, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .webp({ quality: 90 })
    .toFile(`public/images/${filename}`, (error, info) => {
      if (error) {
        return next(error);
      }
      console.log(info);
      next();
    });
};

// Submit new product
router.post(
  "/new",
  // validateProduct,
  upload.single("image"),
  resizeImage,
  catchAsync(async (req, res, next) => {
    // console.log("FILE", req.file);
    // console.log(req.body.product, req.file)
    const newProduct = new Product({
      ...req.body.product,
      // image: req.body.product.image,
    });
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
  })
);

// Get product edit form
router.get(
  "/:id/edit",
  catchAsync(async (req, res, next) => {
    // Fetch categories for dropdown select
    const categories = await Category.find({});

    const product = await Product.findById(req.params.id);
    res.render("products/edit", { product, categories });
  })
);

// Patch product with data from form
router.patch(
  "/:id/edit",
  validateProduct,
  catchAsync(async (req, res, next) => {
    const editedProduct = {
      ...req.body.product,
      _id: req.params.id,
    };
    await Product.findByIdAndUpdate(editedProduct._id, editedProduct);
    res.redirect(`/products/${editedProduct._id}`);
  })
);

// Delete product
router.delete(
  "/:id/delete",
  catchAsync(async (req, res, next) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    console.log(deletedProduct);

    // Also delete associated image
    await fs.unlinkSync(`public/images/${deletedProduct.image}`);
    res.redirect("/products");
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
