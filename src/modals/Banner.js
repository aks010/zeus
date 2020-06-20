const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const BrowseCategory = require("./banners/BrowseCategory");
const BuySellTool = require("./banners/BuySellTool");
const Counter = require("./banners/Counter");
const DreamVehicle = require("./banners/DreamVehicle");
const Guidance = require("./banners/Guidance");
const HotDeal = require("./banners/HotDeal");
const MicroService = require("./banners/MicroService");
const PopularVedios = require("./banners/PopularVideos");
const Press = require("./banners/Press");
const Services = require("./banners/Services");
const Testimonials = require("./banners/Testimonials");
const WhatsPopular = require("./banners/WhatsPopular");

const MODELS = require("../shared/constants");

const BannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "No Title No Banner :P"],
    },
    priority: Number,
    link: String,
    heading: String,
    type: {
      required: true,
      type: String,
      enum: ["simple", "category", "description", "bannerlist"],
    },
    model: {
      type: String,
      required: true,
    },
    // SubClass: Boolean
  },
  {
    timestamps: true,
  }
);

BannerSchema.statics.sendData = async () => {
  try {
    const bannerList = await Banner.find({}, ["model", "title"]);
    let res = {};
    for (const o of bannerList) {
      switch (o["model"]) {
        case MODELS.BROWSECATEGORY: {
          res[o["title"]] = await BrowseCategory.sendData();
          break;
        }
        case MODELS.BUYSELLTOOL: {
          res[o["title"]] = await BuySellTool.sendData();
          break;
        }
        case MODELS.COUNTER: {
          res[o["title"]] = await Counter.sendData();
          break;
        }
        case MODELS.DREAMVEHICLE: {
          res[o["title"]] = await DreamVehicle.sendData();
          break;
        }
        case MODELS.GUIDANCE: {
          res[o["title"]] = await Guidance.sendData();
          break;
        }
        case MODELS.HOTDEAL: {
          res[o["title"]] = await HotDeal.sendData();
          break;
        }
        case MODELS.MICROSERVICE: {
          res[o["title"]] = await MicroService.sendData();
          break;
        }
        case MODELS.POPULARVIDEOS: {
          res[o["title"]] = await PopularVedios.sendData();
          break;
        }
        case MODELS.PRESS: {
          res[o["title"]] = await Press.sendData();
          break;
        }
        case MODELS.SERVICES: {
          res[o["title"]] = await Services.sendData();
          break;
        }
        case MODELS.TESTIMONIALS: {
          res[o["title"]] = await Testimonials.sendData();
          break;
        }
        case MODELS.WHATSPOPULAR: {
          res[o["title"]] = await WhatsPopular.sendData();
          break;
        }
        default:
          throw Error(
            `Requested Model: ${o["model"]}, is not in DB! Please Ensure Correct Model Names`
          );
      }
    }
    return res;
  } catch (e) {
    console.log(e);
    return { message: e.message, status: 500 };
  }
};

autoIncrement.initialize(mongoose.connection);
BannerSchema.plugin(autoIncrement.plugin, "Banner");

var Banner = mongoose.model("Banner", BannerSchema);
module.exports = Banner;
