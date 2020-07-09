const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Spec = require("./Spec");
const CustomSchema = new mongoose.Schema(
  {
    title: String,
    imgLink: String,
    link: String,
    icon: String,
    color: String,
    count: Number,
    price: Number,
    eventDate: Date,
    caption: String,
    type: String,
    eID: mongoose.Types.ObjectId,
    priority: Number,
  },
  {
    timestamps: true,
  }
);

CustomSchema.statics.sendData = async (eID) => {
  try {
    let cn = await Spec.findOne({ eID }, ["-createdAt", "-updatedAt"], {
      lean: true,
    });
    if (!cn) throw new Error("Category Specification not found!!");
    let resSpecs = [];
    for (const [key, value] of Object.entries(cn)) {
      if (value === true) resSpecs.push(key);
    }

    const cns = await Custom.find({ eID }, resSpecs, {
      sort: { priority: 1 },
    });
    let data;
    if (cn["type"] == true) {
      data = {};
      for (const o of cns) {
        if (!data[o["type"]]) {
          data[o["type"]] = [];
        }
        data[o["type"]].push(o);
      }
    } else {
      data = [];
      for (const o of cns) {
        data.push(o);
      }
    }
    return data;
  } catch (e) {
    console.log("Custom Statics Error!");
    throw new Error(e.message);
  }
};

CustomSchema.pre("remove", async (next) => {
  const article = this;
  try {
    let cns;
    const specs = await Spec.findOne({ eID: article["eID"] }, ["type"], {
      lean: true,
    });

    if (specs["type"] == true) {
      cns = await Custom.find({
        eID: cn.eID,
        type: cn.type,
        priority: { $gte: cn.priority },
      });
    } else {
      cns = await Custom.find({
        eID: cn.eID,
        priority: { $gte: cn.priority },
      });
    }
    for (const o of cns) {
      await Custom.updateOne({ _id: o._id }, { priority: o.priority - 1 });
    }
    return next();
  } catch (e) {
    console.log("Middleware Error!");
    throw new Error(e.message);
  }
});

autoIncrement.initialize(mongoose.connection);
CustomSchema.plugin(autoIncrement.plugin, "Custom");

var Custom = mongoose.model("Custom", CustomSchema);
module.exports = Custom;
