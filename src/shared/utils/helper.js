const MODELS = require("../constants");

const Article = require("../models/Type/Article");
const BestVehicle = require("../models/Type/BestVehicle");
const Simple = require("../models/Type/Simple");
const Testimonial = require("../models/Type/Testimonial");
const Vehicle = require("../models/Type/Vehicle");

const getDataFromModel = async (model, ID) => {
  try {
    let data;
    switch (model) {
      case MODELS.ARTICLE: {
        data = await Article.sendData(ID); // array
        break;
      }
      case MODELS.SIMPLE: {
        data = await Simple.sendData(ID);
        break;
      }
      case MODELS.VEHICLE: {
        data = await Vehicle.sendData(ID);
        break;
      }
      case MODELS.TESTIMONIAL: {
        data = await Testimonial.sendData(ID);
        break;
      }
      case MODELS.BEST_VEHICLE: {
        data = await BestVehicle.sendData(ID);
        break;
      }
      default:
        throw Error(
          `Requested Model: ${o["model"]}, is not in DB! Please Ensure Correct Model Names`
        );
    }
    return { error: null, data: data };
  } catch (e) {
    console.log(e.message);
    return { error: e.message, data: undefined };
  }
};

const removeDataFromModel = async (model, categoryID) => {
  try {
    switch (model) {
      case MODELS.ARTICLE: {
        await Article.deleteMany({ categoryID }); // array
        break;
      }
      case MODELS.SIMPLE: {
        await Simple.deleteMany({ categoryID });
        break;
      }
      case MODELS.VEHICLE: {
        await Vehicle.deleteMany({ categoryID });
        break;
      }
      case MODELS.TESTIMONIAL: {
        await Testimonial.deleteMany({ categoryID });
        break;
      }
      case MODELS.BEST_VEHICLE: {
        await BestVehicle.deleteMany({ categoryID });
        break;
      }
      default:
        throw Error(
          `Requested Model: ${o["model"]}, is not in DB! Please Ensure Correct Model Names! And Delete Again`
        );
    }
    return { error: null, message: "Successfully Removed Model!" };
  } catch (e) {
    return { error: e.message, message: null };
  }
};

const removeDataFromCategory = async (ID) => {
  /// ID = bannerID
  try {
    const categoryList = await Category.find({ bannerID }, ["childModel"]);
    for (const o of categoryList) {
      await o.remove();
    }
    return { error: null, message: "Successfully Removed Category!" };
  } catch (e) {
    console.log(e);
    return { error: e.message, message: null };
  }
};

module.exports = {
  getDataFromModel,
  removeDataFromModel,
  removeDataFromCategory,
};
