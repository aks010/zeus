const mongoose = require("mongoose");
const ArticleSchema = new mongoose.Schema(
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

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
