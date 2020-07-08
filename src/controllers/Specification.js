const Banner = require("../models/Banner");
const Category = require("../models/Category");
const Spec = require("../models/Type/Spec");

const Utils = require("../shared/utils/helper");
const SPECIFICATIONS = require("../shared/specifications");

// VIEW SPECIFICATIONS /:model
const ViewSpecification = async (req, res) => {
  const model = req.params.model;
  if (!model)
    return res
      .status(412)
      .send({ message: `Please provide model type`, status: 412 });
  if (Utils.checkModelExistence(model)) {
    if (!SPECIFICATIONS[model])
      return res.status(500).send({
        message: `${model} specification parmas not defined in server!`,
        status: 500,
      });
    return res.send({
      message: "Successfully Fetched Specifications!",
      data: SPECIFICATIONS[model],
    });
  }

  return res.status(500).send({
    message: `${model} model does is not defined in server!`,
    status: 500,
  });
};

// LIST SPECIFICAITONS with Required and Options /:id/:model

const ListSpecification = async (req, res) => {
  const model = req.params.model;
  if (!model)
    return res
      .status(412)
      .send({ message: `Please provide model type`, status: 412 });

  if (Utils.checkModelExistence(model)) {
    if (!SPECIFICATIONS[model])
      return res.status(500).send({
        message: `${model} specification parmas not defined in server!`,
        status: 500,
      });
  }
  if (!req.params.id)
    return res
      .status(412)
      .send({ message: `Please provide model type`, status: 412 });

  if (Utils.checkModelExistence(model)) {
    if (!SPECIFICATIONS[model])
      return res.status(500).send({
        message: `${model} specification parmas not defined in server!`,
        status: 500,
      });

    if (!req.params.id)
      return res
        .status(412)
        .send({ message: `Please provide Parent id`, status: 412 });

    try {
      const specs = await Spec.findOne({ eID: req.params.id }, ["-priority"], {
        lean: true,
      });
      if (!specs)
        return res
          .status(500)
          .send({ message: "Parent Specification not found!!", status: 500 });

      let data = {};
      data["required"] = SPECIFICATIONS[model].required;
      data["options"] = [];
      for (const [key, value] of Object.entries(specs)) {
        if (value === true)
          if (!data["required"].includes(key)) data["options"].push(key);
      }

      return res.send({
        message: "Successfully Fetched Specifications!",
        data,
      });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send({ message: e.message, status: e.code });
    }
  }

  return res.status(500).send({
    message: `${model} model does is not defined in server!`,
    status: 500,
  });
};

// UPDATE SPECIFICATION /:id/:model

const UpdateSpecificaiton = async (req, res) => {
  const model = req.params.model;
  if (!model)
    return res
      .status(412)
      .send({ message: `Please provide model type`, status: 412 });

  if (Utils.checkModelExistence(model)) {
    if (!SPECIFICATIONS[model])
      return res.status(500).send({
        message: `${model} specification parmas not defined in server!`,
        status: 500,
      });
  }
  if (!req.params.id)
    return res
      .status(412)
      .send({ message: `Please provide parent id`, status: 412 });

  let updates = Object.keys(req.body);

  const allowedUpdates = SPECIFICATIONS[model].options;
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    res.status(400).send({
      message: "Requested Params are not allowed to update!",
      status: 400,
    });
  }

  try {
    let cn = await Spec.findOne({ eID: req.params.id });
    if (!cn)
      return res
        .status(500)
        .send({ message: "Specification not found!!", status: 500 });

    let isCategoryArticle = await Category.findOne(
      { _id: req.params.id },
      ["childModel"],
      { lean: true }
    );
    if (!isCategoryArticle) {
      let isBannerModel = await Banner.findOne(
        { _id: req.params.id },
        ["model"],
        { lean: true }
      );
      if (isBannerModel.model.toLowerCase() !== model) {
        return res.status(400).send({
          message: `Model and Banner Model does not match!`,
          status: 400,
        });
      }
    } else if (isCategoryArticle.childModel.toLowerCase() !== model)
      return res.status(400).send({
        message: `Model and Category Model does not match!`,
        status: 400,
      });
    updates.forEach((update) => (cn[update] = req.body[update]));
    await cn.save();
    return res.send({
      message: "Successfully Updated Specifications!",
      data: cn,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).send({ message: e.message, status: e.code });
  }
};

module.exports = {
  ViewSpecification,
  ListSpecification,
  UpdateSpecificaiton,
};
