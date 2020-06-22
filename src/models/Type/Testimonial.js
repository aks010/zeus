const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const TestimonialSchema = new mongoose.Schema(
  {
    imgLink: String,
    link: String,
    caption: String,
    type: {
      type: String,
      required: true,
      lowercase: true,
    },
    categoryID: {
      type: String,
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

TestimonialSchema.statics.sendData = async (categoryID) => {
  try {
    const cn = await Testimonial.find(
      { categoryID },
      [
        "categoryID",
        "type",
        "link",
        "caption",
        "imgLink",
        "reviewerOcc",
        "reviewerAddress",
        "review",
        "reviewer",
        "priority",
      ],
      { sort: { priority: 1 } }
    );

    let rs = [];
    for (const o of cn) {
      switch (o["type"]) {
        case "video": {
          rs[o["type"]].push({
            categoryID: o["categoryID"],
            type: o["type"],
            link: o["link"],
            caption: o["caption"],
            imgLink: o["imgLink"],
          });
          break;
        }
        case "promotion": {
          rs[o["type"]].push({
            categoryID: o["categoryID"],
            type: o["type"],
            link: o["link"],
            imgLink: o["imgLink"],
          });
        }
        case "review": {
          rs[o["type"]].push({
            categoryID: o["categoryID"],
            type: o["type"],
            review: o["review"],
            reviewer: o["reviewer"],
            reviewerAddress: o["reviewerAddress"],
            reviewerOcc: o["reviewerOcc"],
          });
        }
      }
    }
    return rs;
  } catch (e) {
    console.log("Testimonial Statics Error!");
    throw new Error(e.message);
  }
};

TestimonialSchema.pre("remove", async (next) => {
  const testimonial = this;
  try {
    const cn = await Testimonial.find(
      {
        categoryID: testimonial["categoryID"],
        priority: { $gte: testimonial.priority },
        type: testimonial.type,
      },
      ["_id", "priority"]
    );
    for (const o of cn) {
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
