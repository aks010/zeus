const mongoose = require("mongoose");
const MicroServicesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    priority: Number,
    link: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "#ffffff",
    },
    icon: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

var MicroServices = mongoose.model("MicroServices", MicroServicesSchema);
module.exports = MicroServices;
