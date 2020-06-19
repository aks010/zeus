const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
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
autoIncrement.initialize(mongoose.connection);
GuidanceSchema.plugin(autoIncrement.plugin, "Guidance");

var Guidance = mongoose.model("Guidance", GuidanceSchema);
module.exports = Guidance;
