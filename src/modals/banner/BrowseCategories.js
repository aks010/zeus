const mongoose = require("mongoose");
const BrowseCategoriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imgLink: {
      type: String,
      required: true,
    },
    link: String,
    category: {
      type: String,
      required: true,
    },
    priority: Number,
  },
  {
    timestamps: true,
  }
);

var BrowseCategories = mongoose.model(
  "BrowseCategories",
  BrowseCategoriesSchema
);
module.exports = BrowseCategories;
