const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const SpecSchema = new mongoose.Schema(
  {
    title: {
      type: Boolean,
      required: true,
      default: true,
    },
    imgLink: {
      type: Boolean,
      required: true,
      default: true,
    },
    type: {
      type: Boolean,
      required: true,
      default: true,
    },
    link: {
      type: Boolean,
      required: true,
      default: true,
    },
    price: {
      type: Boolean,
      required: true,
      default: true,
    },
    rating: {
      type: Boolean,
      required: true,
      default: true,
    },
    eventDate: {
      type: Boolean,
      required: true,
      default: true,
    },
    caption: {
      type: Boolean,
      required: true,
      default: true,
    },
    eID: {
      type: mongoose.Types.ObjectId,
      required: true,
      default: null,
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
