const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const BuySellToolSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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

BuySellToolSchema.statics.sendData = async () => {
  try {
    const data = await BuySellTool.find({}, [
      "title",
      "count",
      "unit",
      "type",
      "priority",
    ]);
    // console.log(microservices);
    return data;
  } catch (e) {
    // console.log(e.message);
    return { message: e.message };
  }
};

autoIncrement.initialize(mongoose.connection);
BuySellToolSchema.plugin(autoIncrement.plugin, "BuySellTool");

var BuySellTool = mongoose.model("BuySellTool", BuySellToolSchema);
module.exports = BuySellTool;
