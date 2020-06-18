const mongoose = require("mongoose");
const ServicesSchema = new mongoose.Schema(
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
    price: {
      type: Number,
      min: 0,
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

var Services = mongoose.model("Services", ServicesSchema);
module.exports = Services;
