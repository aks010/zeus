const MODELS = require("../constants");

const Article = require("../../models/Type/Article");
const Custom = require("../../models/Type/Custom");
const Testimonial = require("../../models/Type/Testimonial");
const Vehicle = require("../../models/Type/Vehicle");
const WithIcon = require("../../models/Type/WithIcon");
const Category = require("../../models/Category");
const Banner = require("../../models/Banner");
// const cool = require("../../models/Cool");

const modelList = () => {
  const data = Object.values(MODELS);
  console.log(MODELS);
  console.log(data);
  return data;
};

const checkModelExistence = (model) => {
  switch (model.toLowerCase()) {
    case MODELS.ARTICLE.toLowerCase():
      return true;
    case MODELS.CUSTOM.toLowerCase():
      return true;
    case MODELS.VEHICLE.toLowerCase():
      return true;
    case MODELS.TESTIMONIAL.toLowerCase():
      return true;
    case MODELS.WITHICON.toLowerCase():
      return true;
    case MODELS.CATEGORY.toLowerCase():
      return true;
    default:
      return false;
  }
};

const setModelSpecification = async (model, ID) => {
  try {
    console.log("ID: " + ID);
    switch (model) {
      case MODELS.ARTICLE: {
        await Article.SetSpecification(ID); // array
        break;
      }
      case MODELS.CUSTOM: {
        await Custom.SetSpecification(ID);
        break;
      }
      case MODELS.VEHICLE: {
        await Vehicle.SetSpecification(ID);
        break;
      }
      case MODELS.TESTIMONIAL: {
        await Testimonial.SetSpecification(ID);
        break;
      }
      case MODELS.WITHICON: {
        await WithIcon.SetSpecification(ID);
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

const getDataFromModel = async (model, ID) => {
  try {
    let data;
    console.log(model);
    switch (model) {
      case MODELS.ARTICLE: {
        data = await Article.sendData(ID); // array
        break;
      }
      case MODELS.CUSTOM: {
        data = await Custom.sendData(ID);
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
      case MODELS.WITHICON: {
        data = await WithIcon.sendData(ID);
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

const removeDataFromModel = async (model, eID) => {
  try {
    console.log("ENTERNED");
    switch (model) {
      case MODELS.ARTICLE: {
        await Article.deleteMany({ eID }); // array
        break;
      }
      case MODELS.CUSTOM: {
        await Custom.deleteMany({ eID });
        break;
      }
      case MODELS.VEHICLE: {
        await Vehicle.deleteMany({ eID });
        break;
      }
      case MODELS.TESTIMONIAL: {
        await Testimonial.deleteMany({ eID });
        break;
      }
      case MODELS.WITHICON: {
        await WithIcon.deleteMany({ eID });
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
    console.log(Category);
    // console.log(cool);
    const categoryList = await Category.find({ eID: ID }, ["childModel"]);

    console.log("asfasfasd");
    console.log(categoryList);
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
  modelList,
  getDataFromModel,
  setModelSpecification,
  removeDataFromModel,
  removeDataFromCategories,
  checkModelExistence,
};
