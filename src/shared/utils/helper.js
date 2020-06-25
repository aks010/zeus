const MODELS = require("../constants");

const Article = require("../../models/Type/Article");
const Simple = require("../../models/Type/Simple");
const Testimonial = require("../../models/Type/Testimonial");
const Vehicle = require("../../models/Type/Vehicle");
const WithIcon = require("../../models/Type/WithIcon");
const Category = require("../../models/Category");

const checkModelExistence = (model) => {
  switch (model) {
    case MODELS.ARTICLE:
      return true;
    case MODELS.SIMPLE:
      return true;
    case MODELS.VEHICLE:
      return true;
    case MODELS.TESTIMONIAL:
      return true;
    case MODELS.WITHICON:
      return true;
    case MODELS.CATEGORY:
      return true;
    default:
      return false;
  }
};
const setModelSpecification = async (model, ID, isBanner = false) => {
  try {
    console.log("ID: " + ID);
    switch (model) {
      case MODELS.ARTICLE: {
        await Article.SetSpecification(ID, isBanner); // array
        break;
      }
      case MODELS.SIMPLE: {
        await Simple.SetSpecification(ID, isBanner);
        break;
      }
      case MODELS.VEHICLE: {
        await Vehicle.SetSpecification(ID, isBanner);
        break;
      }
      case MODELS.TESTIMONIAL: {
        await Testimonial.SetSpecification(ID, isBanner);
        break;
      }
      case MODELS.WITHICON: {
        await WithIcon.SetSpecification(ID, isBanner);
        break;
      }
      case MODELS.CATEGORY: {
        break;
      }
      default:
        throw Error(
          `Requested Model: ${model}, is not in DB! Please Ensure Correct Model Names`
        );
    }
    return { error: null };
  } catch (e) {
    console.log(e.message);
    throw new Error(e.message);
  }
};
const getDataFromModel = async (model, ID, isBanner = false) => {
  try {
    let data;
    console.log(model);
    switch (model) {
      case MODELS.ARTICLE: {
        data = await Article.sendData(ID, isBanner); // array
        break;
      }
      case MODELS.SIMPLE: {
        data = await Simple.sendData(ID, isBanner);
        break;
      }
      case MODELS.VEHICLE: {
        data = await Vehicle.sendData(ID, isBanner);
        break;
      }
      case MODELS.TESTIMONIAL: {
        data = await Testimonial.sendData(ID, isBanner);
        break;
      }
      case MODELS.WITHICON: {
        data = await WithIcon.sendData(ID, isBanner);
        break;
      }
      default:
        throw Error(
          `Requested Model: ${model}, is not in DB! Please Ensure Correct Model Names`
        );
    }
    return { error: undefined, data: data };
  } catch (e) {
    console.log(e.message);
    return { error: e.message, data: undefined };
  }
};

// FIX FOR ISBANNER = true

const removeDataFromModel = async (model, categoryID) => {
  try {
    console.log("ENTERNED");
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
      case MODELS.WITHICON: {
        await WithIcon.deleteMany({ categoryID });
        break;
      }
      default:
        throw Error(
          `Requested Model: ${model}, is not in DB! Please Ensure Correct Model Names! And Delete Again`
        );
    }
    return { error: null, message: "Successfully Removed Model!" };
  } catch (e) {
    return { error: e.message, message: null };
  }
};

const removeDataFromCategories = async (ID) => {
  /// ID = bannerID
  console.log("asfasf");
  try {
    const categoryList = await Category.find({ bannerID: ID }, ["childModel"]);
    console.log("asfasfasd");
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
  setModelSpecification,
  removeDataFromModel,
  removeDataFromCategories,
  checkModelExistence,
};
