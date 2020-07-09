const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const SPECIFICATIONS = require("../../shared/specifications");

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

    icon: {
      type: Boolean,
      required: true,
      default: false,
    },
    color: {
      type: Boolean,
      required: true,
      default: false,
    },
    count: {
      type: Boolean,
      required: true,
      default: false,
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

SpecSchema.statics.SetModelSpecification = async (model, eID, data = []) => {
  /// UPDATE FOR USE IN BANNER WITHOUT CATEGORY USING ISBANNER FIELD
  try {
    if (!eID || eID == "")
      throw new Error("Cannot Set Specification without ID");
    if (!model || model == "")
      throw new Error("Cannot Set Specification without ID");
    // model = model.toLowerCase();
    const required = SPECIFICATIONS[model.toLowerCase()].required;
    const options = SPECIFICATIONS[model.toLowerCase()].options;
    const specification = {};
    required.forEach((el) => (specification[el] = true));
    options.forEach((el) => {
      if (data.includes(el)) specification[el] = true;
    });
    const specs = new Spec({ ...specification, eID });
    await specs.save();
  } catch (e) {
    console.log(e.message);
    throw new Error(e.message);
  }
};

autoIncrement.initialize(mongoose.connection);
SpecSchema.plugin(autoIncrement.plugin, "Spec");

var Spec = mongoose.model("Spec", SpecSchema);
module.exports = Spec;
