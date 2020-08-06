const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Spec = require("./Spec");

const TestimonialSchema = new mongoose.Schema(
  {
    title: String,
    imgLink: String,
    link: String,
    caption: String,
    type: {
      type: String,
      lowercase: true,
    },
    eID: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    reviewerOcc: String,
    reviewerAddress: String,
    review: String,
    reviewer: String,
    priority: Number,
  },
  {
    timestamps: true,
  }
);

TestimonialSchema.statics.sendData = async (eID) => {
  /// UPDATE THIS USING SPECIFICATION
  try {
    let cn = await Spec.findOne({ eID }, ["-createdAt", "-updatedAt"], {
      lean: true,
    });
    if (!cn) throw new Error("Category Specification not found!!");
    let resSpecs = [];
    for (const [key, value] of Object.entries(cn)) {
      if (value === true) resSpecs.push(key);
    }

    const cns = await Testimonial.find({ eID }, resSpecs, {
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
    console.log("Testimonial Statics Error");
    throw new Error(e.message);
  }
};

TestimonialSchema.pre("remove", async function (next) {
  const cn = this;
  try {
    let cns;
    const specs = await Spec.findOne({ eID: cn["eID"] }, ["type"], {
      lean: true,
    });
    console.log(specs);

    if (specs["type"] == true) {
      cns = await Testimonial.find({
        eID: cn.eID,
        type: cn.type,
        priority: { $gte: cn.priority },
      });
    } else {
      cns = await Testimonial.find({
        eID: cn.eID,
        priority: { $gte: cn.priority },
      });
    }
    for (const o of cns) {
      await Testimonial.updateOne({ _id: o._id }, { priority: o.priority - 1 });
    }
    return next();
  } catch (e) {
    console.log("Middleware Error!");
    throw new Error(e.message);
  }
});

autoIncrement.initialize(mongoose.connection);
TestimonialSchema.plugin(autoIncrement.plugin, "Testimonial");

var Testimonial = mongoose.model("Testimonial", TestimonialSchema);
module.exports = Testimonial;
