const mongoose = require("mongoose");
const WhatsPopularSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    imgLink: {
      type: String,
      required: true,
    },
    link: String,
    priority: Number,
  },
  {
    timestamps: true,
  }
);

var WhatsPopular = mongoose.model("WhatsPopular", WhatsPopularSchema);
module.exports = WhatsPopular;
