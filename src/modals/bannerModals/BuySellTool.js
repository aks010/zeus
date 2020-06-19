const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const BuySellToolSchema = new mongoose.Schema(
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

autoIncrement.initialize(mongoose.connection);
BuySellToolSchema.plugin(autoIncrement.plugin, "BuySellTool");

var BuySellTool = mongoose.model("BuySellTool", BuySellToolSchema);
module.exports = BuySellTool;
