const mongoose = require("mongoose");
const Category = require("./category")

const Schema = mongoose.Schema;

// Define database schema
const productSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: Category,
  },
});

// Create url as virtual property
productSchema.virtual("url").get(function () {
  return `/products/${this._id}`;
});

// Create model
const Product = mongoose.model("Product", productSchema);

// Export model
module.exports = Product;
