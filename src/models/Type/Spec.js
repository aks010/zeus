const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const SpecSchema = new mongoose.Schema(
  {
    title: {
      type: Boolean,
      required: true,
      default: false,
    },
    imgLink: {
      type: Boolean,
      required: true,
      default: false,
    },
    type: {
      type: Boolean,
      required: true,
      default: false,
    },
    link: {
      type: Boolean,
      required: true,
      default: false,
    },
    price: {
      type: Boolean,
      required: true,
      default: false,
    },
    rating: {
      type: Boolean,
      required: true,
      default: false,
    },
    eventDate: {
      type: Boolean,
      required: true,
      default: false,
    },
    caption: {
      type: Boolean,
      required: true,
      default: false,
    },
    categoryID: {
      type: Number,
      required: true,
      default: null,
    },
    bannerID: {
      type: Number,
      required: true,
      default: null,
    },
    isBanner: {
      type: Boolean,
      default: false,
      required: true,
    },
    priority: {
      type: Boolean,
      default: true,
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
