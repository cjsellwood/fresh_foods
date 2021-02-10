const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const ExpressError = require("./utils/ExpressError");

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

// import routers
const productRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");

// Routers
app.use("/products", productRouter);
app.use("/categories", categoriesRouter);

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Handle not found error
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

// Handle errors
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  if (!err.msg) {
    err.msg = "Oh no, there was an error";
  }
  res.status(statusCode).render("error", { err });
});

// Create server to listen on
app.listen(3000, () => {
  console.log("On Port 3000");
});
