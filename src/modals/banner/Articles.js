const mongoose = require("mongoose");
const ArticlesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imgLink: {
      type: String,
      required: true,
    },
    link: { type: String, required: true },
    publishDate: { type: Date, required: true },
    caption: { type: String, required: true },
    vehicleType: {
      type: String,
      //   enum: ["car", "scooter", "bike"],
      lowercase: true,
    },
    category: {
      type: String,
      //   enum: ["news", "expertReview"],
      required: true,
    },
    priority: Number,
  },
  {
    timestamps: true,
  }
);

var Articles = mongoose.model("Articles", ArticlesSchema);
module.exports = Articles;
