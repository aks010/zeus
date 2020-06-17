const mongoose = require("mongoose");
const BannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "No Title No Banner :P"],
    },
    priority: Number,
  },
  {
    timestamps: true,
  }
);

var Banners = mongoose.model("Banners", BannerSchema);
module.exports = Banners;
