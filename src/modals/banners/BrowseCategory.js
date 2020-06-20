const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const BrowseCategorySchema = new mongoose.Schema(
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

autoIncrement.initialize(mongoose.connection);
BrowseCategorySchema.plugin(autoIncrement.plugin, "BrowseCategory");

var BrowseCategory = mongoose.model("BrowseCategory", BrowseCategorySchema);
module.exports = BrowseCategory;
