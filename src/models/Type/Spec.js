const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const SpecSchema = new mongoose.Schema(
  {
    title: {
      type: Boolean,
      required: true,
    },
    imgLink: {
      type: Boolean,
      required: true,
    },
    link: {
      type: Boolean,
      required: true,
    },
    price: {
      type: Boolean,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    caption: {
      type: Boolean,
      required: true,
    },
    categoryID: {
      type: Boolean,
      required: true,
    },
    bannerID: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

autoIncrement.initialize(mongoose.connection);
SpecSchema.plugin(autoIncrement.plugin, "Spec");

var Spec = mongoose.model("Spec", SpecSchema);
module.exports = Spec;
