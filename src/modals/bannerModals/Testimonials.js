const mongoose = require("mongoose");
const TestimonialsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["video", "review", "promotion"],
      unique: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["buyer", "seller", "tvc"],
    },
    link: String,
    caption: String,
    thumbnail: String,
    review: String,
    reviewer: String,
    reviewerOcc: String,
    reviewerAddress: String,
    priority: Number,
  },
  {
    timestamps: true,
  }
);

var Testimonials = mongoose.model("Testimonials", TestimonialsSchema);
module.exports = Testimonials;
