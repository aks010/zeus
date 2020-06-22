const mongoose = require("mongoose");
const PressSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    imgLink: {
      type: String,
      required: true,
    },
    link: String,
    priority: Number,
  },
  {
    timestamps: true,
  }
);

var Press = mongoose.model("Press", PressSchema);
module.exports = Press;
