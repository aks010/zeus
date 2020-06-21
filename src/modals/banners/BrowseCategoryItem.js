const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const BrowseCategoryItemSchema = new mongoose.Schema(
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
    categoryID: {
      type: Number,
      required: true,
    },
    priority: Number,
  },
  {
    timestamps: true,
  }
);

autoIncrement.initialize(mongoose.connection);
BrowseCategoryItemSchema.plugin(autoIncrement.plugin, "BrowseCategoryItem");

var BrowseCategoryItem = mongoose.model(
  "BrowseCategoryItem",
  BrowseCategoryItemSchema
);
module.exports = BrowseCategoryItem;
