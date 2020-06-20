const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
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

CounterSchema.statics.sendData = async () => {
  try {
    const counter = await Counter.find({}, [
      "title",
      "count",
      "unit",
      "type",
      "priority",
    ]);
    // console.log(microservices);
    return counter;
  } catch (e) {
    // console.log(e.message);
    return { message: e.message };
  }
};

autoIncrement.initialize(mongoose.connection);
CounterSchema.plugin(autoIncrement.plugin, "Counter");
var Counter = mongoose.model("Counter", CounterSchema);
module.exports = Counter;
