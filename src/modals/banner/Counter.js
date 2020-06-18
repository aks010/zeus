const mongoose = require("mongoose");
const CounterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    count: {
      type: Number,
      required: true,
    },
    unit: String,
    type: {
      type: String,
      default: "exact",
      enum: ["exact", "greater"],
    },
    priority: Number,
  },
  {
    timestamps: true,
  }
);

var Counter = mongoose.model("Counter", CounterSchema);
module.exports = Counter;
