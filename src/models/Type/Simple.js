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
    categoryID: Number,
    bannerID: Number,
    priority: Number,
  },
  {
    timestamps: true,
  }
);

SimpleSchema.statics.sendData = async (ID, isBanner = true) => {
  let specs, data;
  try {
    if (isBanner) {
      specs = await Spec.findOne({ bannerID: ID }); // object
    } else specs = await Spec.findOne({ categoryID: ID }); //object
    // get specs which are required in array
    let reqSpecs = [];
    for (const [key, value] of Object.entries(specs)) {
      if (value) reqSpecs.push(key);
    }
    if (isBanner)
      data = await Simple.find({ bannerID: ID }, reqSpecs, {
        sort: { priority: 1 },
      });
    else
      data = await Simple.find({ categoryID: ID }, reqSpecs, {
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
