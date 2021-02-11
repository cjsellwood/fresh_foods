const mongoose = require("mongoose");
const Product = require("./models/product");
const Category = require("./models/category");

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

// Seed categories
const categories = [
  {
    name: "Fruit",
    description:
      "Tasty and healthy fruits Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt fugit blanditiis aspernatur sequi doloribus, quasi iusto. Fuga illum, cum hic, a laboriosam quaerat nihil qui officiis quas quia ea quo!",
  },
  {
    name: "Vegetable",
    description:
      "Healthy vegetables Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt fugit blanditiis aspernatur sequi doloribus, quasi iusto. Fuga illum, cum hic, a laboriosam quaerat nihil qui officiis quas quia ea quo!",
  },
  {
    name: "Confectionary",
    description:
      "Yummy confectionary Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt fugit blanditiis aspernatur sequi doloribus, quasi iusto. Fuga illum, cum hic, a laboriosam quaerat nihil qui officiis quas quia ea quo!",
  },
  {
    name: "Dairy",
    description:
      "Delicious milk based foods Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt fugit blanditiis aspernatur sequi doloribus, quasi iusto. Fuga illum, cum hic, a laboriosam quaerat nihil qui officiis quas quia ea quo!",
  },
];

// Seed products
const products = [
  {
    name: "Apple",
    price: 2,
    description:
      "Fresh apple Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt fugit blanditiis aspernatur sequi doloribus, quasi iusto. Fuga illum, cum hic, a laboriosam quaerat nihil qui officiis quas quia ea quo!",
    quantity: 5,
    category: "Fruit",
    image: "apple.webp"
  },
  {
    name: "Orange",
    price: 3,
    description:
      "Juicy orange Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt fugit blanditiis aspernatur sequi doloribus, quasi iusto. Fuga illum, cum hic, a laboriosam quaerat nihil qui officiis quas quia ea quo!",
    quantity: 7,
    category: "Fruit",
    image: "orange.webp"
  },
  {
    name: "Milk",
    price: 1,
    description:
      "Delicious milk Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt fugit blanditiis aspernatur sequi doloribus, quasi iusto. Fuga illum, cum hic, a laboriosam quaerat nihil qui officiis quas quia ea quo!",
    quantity: 34,
    category: "Dairy",
    image: "milk.webp"
  },
  {
    name: "Chocolate",
    price: 4.5,
    description:
      "Smooth chocolate Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt fugit blanditiis aspernatur sequi doloribus, quasi iusto. Fuga illum, cum hic, a laboriosam quaerat nihil qui officiis quas quia ea quo!",
    quantity: 9,
    category: "Confectionary",
    image: "chocolate.webp"
  },
  {
    name: "Potato",
    price: 1.5,
    description:
      "Fine potato Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt fugit blanditiis aspernatur sequi doloribus, quasi iusto. Fuga illum, cum hic, a laboriosam quaerat nihil qui officiis quas quia ea quo!",
    quantity: 73,
    category: "Vegetable",
    image: "potato.webp"
  },
];

const seedCategories = async () => {
  try {
    // Delete all
    await Category.deleteMany({});

    // Add seed categories
    await Category.insertMany(categories);

    console.log("Saved categories");
  } catch (err) {
    console.log(err);
  }
};

const seedProducts = async () => {
  try {
    // Delete all
    await Product.deleteMany({});

    // Loop over products
    for (let product of products) {
      // Get object if of specified category
      const category = await Category.findOne({ name: product.category });
      console.log("----", category)

      // Create new product
      const newProduct = new Product({
        ...product,
        category: category._id,
      });

      console.log("....", newProduct)

      // Save new product
      await newProduct.save();
    }
  } catch (err) {
    console.log(err);
  }
};

// Do all
const run = async () => {
  await seedCategories();
  await seedProducts();
  mongoose.connection.close();
};

run();
