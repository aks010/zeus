const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const BannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "No Title No Banner :P"],
    },
    priority: Number,
    link: String,
    heading: String,
    type: {
      required: true,
      type: String,
      enum: ["simple", "category", "description", "bannerlist"],
    },
    // SubClass: Boolean
  },
  {
    timestamps: true,
  }
);

autoIncrement.initialize(mongoose.connection);
BannerSchema.plugin(autoIncrement.plugin, "Banner");
var Banner = mongoose.model("Banner", BannerSchema);
module.exports = Banner;
