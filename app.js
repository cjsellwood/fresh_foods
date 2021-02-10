const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Product = require("./models/product");
const Category = require("./models/category")

// Connect mongodb
mongoose.connect("mongodb://localhost:27017/fresh_foods", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

// Set engine for ejs mate so that can use block template
app.engine("ejs", ejsMate);

// Set template creator to ejs
app.set("view engine", "ejs");

// Set path to template folder
app.set("views", path.join(__dirname, "views"));

// For getting form data
app.use(express.urlencoded({ extended: true }));

// For allowing use of different methods
app.use(methodOverride("_method"));

// For serving static files
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Products page
app.get("/products", async (req, res) => {
  const products = await Product.find({}).populate("category");
  res.render("products", { products });
});

// Categories page
app.get("/categories", async (req, res) => {
  const categories = await Category.find({});
  res.render("categories", { categories });
});

// Create server to listen on
app.listen(3000, () => {
  console.log("On Port 3000");
});
