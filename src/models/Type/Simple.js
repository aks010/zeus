const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Spec = require("./Spec");
const SimpleSchema = new mongoose.Schema(
  {
    title: String,
    imgLink: String,
    link: String,
    price: Number,
    eventDate: Date,
    caption: String,
    eID: mongoose.Types.ObjectId,
    priority: Number,
  },
  {
    timestamps: true,
  }
);

SimpleSchema.statics.sendData = async (ID) => {
  let specs, data;
  try {
    specs = await Spec.findOne({ eID: ID }, ["-createdAt", "-updatedAt"], {
      lean: true,
    }); // object
    // get specs which are required in array
    let reqSpecs = [];
    for (const [key, value] of Object.entries(specs)) {
      if (value == true) reqSpecs.push(key);
    }
    reqSpecs.push("priority");
    data = await Simple.find({ eID: ID }, reqSpecs, {
      sort: { priority: 1 },
    });
    return data;
  } catch (e) {
    console.log("Simple Statics Error!");
    throw new Error(e.message);
  }
};

autoIncrement.initialize(mongoose.connection);
SimpleSchema.plugin(autoIncrement.plugin, "Simple");

var Simple = mongoose.model("Simple", SimpleSchema);
module.exports = Simple;
