const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const MicroServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title cannot be empty!"],
      trim: true,
    },
    priority: Number,
    link: {
      type: String,
      required: [true, "Link cannot be empty!"],
    },
    color: {
      type: String,
      default: "#ffffff",
    },
    icon: {
      type: String,
      required: [true, "Icon Link cannot be empty!"],
    },
  },
  {
    timestamps: true,
  }
);
autoIncrement.initialize(mongoose.connection);
MicroServiceSchema.plugin(autoIncrement.plugin, {
  model: "MicroService",
  field: "msId",
});

var MicroService = mongoose.model("MicroService", MicroServiceSchema);
module.exports = MicroService;
