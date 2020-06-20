const mongoose = require("mongoose");
const PopularVideosSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    caption: String,
    link: { type: String, required: true },
    publishDate: {
      type: Date,
      required: true,
    },
    priority: Number,
  },
  {
    timestamps: true,
  }
);

var PopularVideos = mongoose.model("PopularVideos", PopularVideosSchema);
module.exports = PopularVideos;
