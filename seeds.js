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
    description: "Tasty and healthy fruits",
  },
  {
    name: "Vegetable",
    description: "Healthy vegetables",
  },
  {
    name: "Confectionary",
    description: "Yummy confectionary",
  },
  {
    name: "Dairy",
    description: "Delicious milk based foods",
  },
];

// Seed products
const products = [
  {
    name: "Apple",
    price: 2,
    description: "Fresh apple",
    quantity: 5,
    category: "Fruit",
  },
  {
    name: "Orange",
    price: 3,
    description: "Juicy orange",
    quantity: 7,
    category: "Fruit",
  },
  {
    name: "Milk",
    price: 1,
    description: "Delicious milk",
    quantity: 34,
    category: "Dairy",
  },
  {
    name: "Chocolate",
    price: 4.5,
    description: "Smooth chocolate",
    quantity: 9,
    category: "Confectionary",
  },
  {
    name: "Potato",
    price: 1.5,
    description: "Fine potato",
    quantity: 73,
    category: "Vegetable",
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
      const category = await Category.find({ name: product.category });

      // Create new product
      const newProduct = new Product({
        ...product,
        category: category._id,
      });

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
