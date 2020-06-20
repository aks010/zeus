const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const HotDealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    caption: {
      type: String,
      default: "Click to Buy",
    },
    link: {
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
HotDealSchema.plugin(autoIncrement.plugin, "HotDeal");

var HotDeal = mongoose.model("HotDeal", HotDealSchema);
module.exports = HotDeal;
