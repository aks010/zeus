const mongoose = require("mongoose");
const DreamVehiclesSchema = new mongoose.Schema(
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

var DreamVehicles = mongoose.model("DreamVehicles", DreamVehiclesSchema);
module.exports = DreamVehicles;
