const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const Category = require("./Category");
const Utils = require("../shared/utils/helper");

const BannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "No Title No Banner :P"],
    },
    priority: Number,
    link: String,
    model: {
      type: String,
      required: true,
    },
    hasCategory: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

BannerSchema.statics.sendData = async () => {
  try {
    const bannerList = await Banner.find({}, ["model", "title", "hasCategory"]);
    let res = [];

    for (const o of bannerList) {
      let data;
      if (o["hasCategory"]) {
        data = await Category.sendData(o["_id"]);
      } else {
        let { error, response } = await Utils.getDataFromModel(
          o["model"],
          o["_id"]
        ); /// TEST FOR ERROR THROW FROM FUNCTION
        if (error != null) throw new Error(error);
        data = response;
      }
      let obj = {};
      obj.items = data; // array
      obj.cID = o["_id"];
      obj.link = o["link"];
      obj.title = o["title"];
      obj.priority = o["priority"];
      res.push(obj);
    }
    return res;
  } catch (e) {
    console.log(e);
    return { message: e.message, status: 500 };
  }
};

/// CASCADE DELETE
BannerSchema.pre("remove", async function (next) {
  const banner = this;
  try {
    if (banner["hasCategory"]) {
      const { error, message } = await Utils.removeDataFromCategories(
        banner["_id"]
      );
      if (!error) next();
      else throw new Error(error);
    } else {
      const { error, message } = await Utils.removeDataFromModel(
        banner["model"],
        banner["_id"]
      );
      if (!error) return next();
      else throw new Error(error);
    }
  } catch (e) {
    console.log("Middleware Error!");
    /// todo: EXECUTE ERROR OR MESSAGE
    throw new Error(e.message);
  }
});

autoIncrement.initialize(mongoose.connection);
BannerSchema.plugin(autoIncrement.plugin, "Banner");

var Banner = mongoose.model("Banner", BannerSchema);
module.exports = Banner;
