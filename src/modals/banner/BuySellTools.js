const mongoose = require("mongoose");
const BuySellToolsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    icon: {
      type: String,
      required: true,
    },
    priority: Number,
  },
  {
    timestamps: true,
  }
);

var BuySellTools = mongoose.model("BuySellTools", BuySellToolsSchema);
module.exports = BuySellTools;
