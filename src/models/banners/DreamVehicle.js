const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const DreamVehicleSchema = new mongoose.Schema(
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

autoIncrement.initialize(mongoose.connection);
DreamVehicleSchema.plugin(autoIncrement.plugin, "DreamVehicle");

var DreamVehicle = mongoose.model("DreamVehicle", DreamVehicleSchema);
module.exports = DreamVehicle;
