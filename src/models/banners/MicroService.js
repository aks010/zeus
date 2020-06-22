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

MicroServiceSchema.statics.sendData = async () => {
  try {
    const microservices = await MicroService.find({}, [
      "title",
      "priority",
      "link",
      "color",
      "icon",
    ]);
    // console.log(microservices);
    return microservices;
  } catch (e) {
    // console.log(e.message);
    return { message: e.message };
  }
};

autoIncrement.initialize(mongoose.connection);
MicroServiceSchema.plugin(autoIncrement.plugin, {
  model: "MicroService",
  field: "msId",
});

var MicroService = mongoose.model("MicroService", MicroServiceSchema);
module.exports = MicroService;
