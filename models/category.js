const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

// Create url as virtual property
categorySchema.virtual("url").get(function () {
  return `/categories/${this._id}`;
});

// Create category model
const Category = mongoose.model("Category", categorySchema);

// Export model
module.exports = Category;
