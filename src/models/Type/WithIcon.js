const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
/// MICROSERVICES & BUY SELL TOOLS
const WithIconSchema = new mongoose.Schema(
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
    eID: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

WithIconSchema.statics.sendData = async (eID) => {
  try {
    const cns = await MicroService.find({ eID }, [
      "title",
      "priority",
      "link",
      "color",
      "icon",
    ]);
    return cns;
  } catch (e) {
    console.log("WithIcon statics error!");
    throw new Error(e.message);
  }
};

autoIncrement.initialize(mongoose.connection);
WithIconSchema.plugin(autoIncrement.plugin, "WithIcon");

var WithIcon = mongoose.model("WithIcon", WithIconSchema);
module.exports = WithIcon;
