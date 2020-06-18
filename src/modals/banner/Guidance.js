const mongoose = require("mongoose");
const GuidanceSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,
    },
    link: String,
    priority: Number,
  },
  {
    timestamps: true,
  }
);

var Guidance = mongoose.model("Guidance", GuidanceSchema);
module.exports = Guidance;
