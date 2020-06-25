const Custom = require("../models/Type/Custom");
const Spec = require("../models/Type/Spec");
const Category = require("../models/Category");
const Banner = require("../models/Banner");

const MODELS = require("../shared/constants");

/// List Items of Category /:id
const List = async (req, res) => {
  if (!req.params.id)
    return res
      .status(400)
      .send({ message: `Please provide banner id`, status: 400 });
  try {
    let cn = await Spec.findOne(
      { eID: req.params.id },
      ["-createdAt", "-updatedAt"],
      { lean: true }
    );
    if (!cn)
      return res
        .status(500)
        .send({ message: "Category Specification not found!!", status: 500 });
    let resSpecs = [];
    for (const [key, value] of Object.entries(cn)) {
      if (value === true) resSpecs.push(key);
    }

    const cns = await Custom.find({ eID: req.params.id }, resSpecs, {
      sort: { priority: 1 },
    });
    let data;
    if (cn["type"] == true) {
      data = {};
      for (const o of cns) {
        if (!data[o["type"]]) {
          data[o["type"]] = [];
        }
        data[o["type"]].push(o);
      }
    } else {
      data = [];
      for (const o of cns) {
        data.push(o);
      }
    }
    res.send({
      message: "Items Fetched Successfully!",
      status: 200,
      data: data,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: e.message, status: 500 });
  }
};

/// GET CUSTOM /:cID/:id
const GetItem = async (req, res) => {
  if (!req.params.id || !req.params.cID)
    return res.status(412).send({
      message: `Please provide ${!req.params.cID ? "category id" : "item id"}`,
      status: 412,
    });

  try {
    let cn = await Spec.findOne(
      { eID: req.params.cID },
      ["-createdAt", "-updatedAt"],
      { lean: true }
    );
    if (!cn)
      return res
        .status(500)
        .send({ message: "Category Specification not found!!", status: 500 });
    let resSpecs = [];
    for (const [key, value] of Object.entries(cn)) {
      if (value === true) resSpecs.push(key);
    }
    const o = await Custom.find({ _id: req.params.id }, resSpecs);
    return res.send({ message: "Item Fetched", status: 200, data: o });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ message: e.message, status: 500 });
  }
};

// LIST SPECS WITH OPTIONS AND DISABLED /:id
const ListSpecification = async (req, res) => {
  if (!req.params.id)
    return res
      .status(412)
      .send({ message: `Please provide Category id`, status: 412 });

  try {
    const specs = await Spec.findOne({ eID: req.params.id }, ["-priority"], {
      lean: true,
    });
    if (!specs)
      return res
        .status(500)
        .send({ message: "Category Specification not found!!", status: 500 });

    let isCategoryModel = await Category.findOne(
      { _id: req.params.id },
      ["childModel"],
      { lean: true }
    );
    if (isCategoryModel.childModel !== MODELS.CUSTOM)
      return res.status(400).send({
        message: `Model and Category Model does not match!`,
        status: 400,
      });
    let data = {};
    data["required"] = [];
    data["options"] = [];
    for (const [key, value] of Object.entries(specs)) {
      if (value === true)
        if (!data["required"].includes(key)) data["options"].push(key);
    }

    return res.send({ message: "Successfully Fetched Specifications!", data });
  } catch (e) {
    console.log(e.message);
    return res.status(500).send({ message: e.message, status: e.code });
  }
};

// UPDATE SPECIFICATION OF MODEL
const UpdateSpecificaiton = async (req, res) => {
  if (!req.params.id)
    return res
      .status(412)
      .send({ message: `Please provide Category id`, status: 412 });
  let updates = Object.keys(req.body);
  const allowedUpdates = ["eventDate", "type", "price", "rating"];
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
        .send({ message: "Category Specification not found!!", status: 500 });

    let isCategoryModel = await Category.findOne(
      { _id: req.params.id },
      ["childModel"],
      { lean: true }
    );
    if (!isCategoryModel) {
      let isBannerModel = await Banner.findOne(
        { _id: req.params.id },
        ["model"],
        { lean: true }
      );
      if (isBannerModel.childModel !== MODELS.CUSTOM) {
        return res.status(400).send({
          message: `Model and Category Model does not match!`,
          status: 400,
        });
      }
    } else if (isCategoryModel.childModel !== MODELS.CUSTOM)
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

// UPDATE PRIORITY OF CATEGORY /:id/:type
const UpdatePriority = async (req, res) => {
  if (!req.params.id)
    return res
      .status(412)
      .send({ message: `Please provide category id`, status: 412 });
  let cn = Object.keys(req.body);
  let min = 1000000;
  cn = cn.map((o) => {
    min = min < parseInt(req.body[o]) ? min : parseInt(req.body[o]);
    return parseInt(o);
  });

  try {
    const specs = await Spec.findOne({ eID: req.params.id }, ["type"], {
      lean: true,
    });
    if (!specs)
      return res
        .status(500)
        .send({ message: "Category Specification not found!!", status: 500 });

    let allowedIds;
    if (specs["type"]) {
      if (!req.params.type)
        return res
          .status(412)
          .send({ message: `Please provide Item type`, status: 412 });
      allowedIds = await Custom.find(
        { eID: req.params.id, type: req.params.type },
        ["_id"],
        { lean: true }
      );
    } else {
      allowedIds = await Custom.find({ eID: req.params.id }, ["_id"]);
    }
    let allowedUpdates = [];
    // console.log(allowedIds);
    allowedIds.forEach((o) => allowedUpdates.push(o["_id"]));
    let isValidOperation = cn.every((update) =>
      allowedUpdates.includes(update)
    );
    // console.log(allowedUpdates);
    if (!isValidOperation) {
      return res.status(400).send({
        message: "Incomplete list of items for setting priority",
        code: 400,
      });
      412;
    }

    isValidOperation = allowedUpdates.every((update) => cn.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({
        message: "Incomplete list of items for setting priority",
        code: 400,
      });
    }

    for (const o of cn) {
      await Custom.findOneAndUpdate(
        { _id: o },
        { priority: req.body[o] - min }
      );
    }
    res.send({ message: "Successfully Updated Priority!", status: 200 });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: e.message, status: e.code });
  }
};

/// UPDATE ITEM /:id

const UpdateItem = async (req, res) => {
  if (!req.params.id)
    return res
      .status(412)
      .send({ message: `Please provide item id`, status: 412 });

  try {
    let updates = Object.keys(req.body);
    let cn = await Custom.findOne({ _id: req.params.id });
    if (!cn)
      return res
        .status(400)
        .send({ message: "Item does not exist!", status: 400 });
    console.log(cn["eID"]);
    let specs = await Spec.findOne({ eID: cn["eID"] }, ["-priority"], {
      lean: true,
    });
    if (!specs)
      return res
        .status(500)
        .send({ message: "Category Specification not found!!", status: 500 });

    let resSpecs = [];
    for (const [key, value] of Object.entries(specs)) {
      if (value === true) resSpecs.push(key);
    }
    const allowedUpdates = resSpecs;
    // console.log(allowedUpdates);
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      res
        .status(400)
        .send({ message: "Cannot Update requested fields!", status: 400 });
    }

    updates.forEach((update) => (cn[update] = req.body[update]));
    let isDuplicate;
    if (specs["type"] == true) {
      isDuplicate = await Custom.findOne({
        title: cn.title,
        type: cn.type,
        eID: cn.eID,
      });
    } else {
      isDuplicate = await Custom.findOne({
        title: cn.title,
        eID: cn.eID,
      });
    }

    if (isDuplicate && isDuplicate["eID"] != cn.eID)
      return res.status(400).send({ message: "Title is in use!", status: 400 });
    await cn.save();

    return res.send({
      message: "Updated Item Successfully!",
      status: 200,
      data: cn,
    });
  } catch (e) {
    console.log(e.message);
  }
};

/// CREATE ITEM OF CATEGORY /:id/:type
const Create = async (req, res) => {
  if (!req.params.id || !req.body.title || req.body.title == null)
    return res.status(412).send({
      message: `Please provide ${
        !req.params.id ? "Category id" : "Item title"
      }`,
      status: 412,
    });
  try {
    let cn;
    let isCategoryModel = await Category.findOne(
      { _id: req.params.id },
      ["childModel"],
      { lean: true }
    );
    if (!isCategoryModel) {
      let isBannerModel = await Banner.findOne(
        { _id: req.params.id },
        ["model"],
        { lean: true }
      );
      if (isBannerModel.childModel !== MODELS.CUSTOM) {
        return res.status(400).send({
          message: `Model and Category Model does not match!`,
          status: 400,
        });
      }
    } else if (isCategoryModel.childModel !== MODELS.CUSTOM)
      return res.status(400).send({
        message: `Model and Category Model does not match!`,
        status: 400,
      });
    const specs = await Spec.findOne(
      { eID: req.params.id },
      ["-createdAt", "-updatedAt", "-priority"],
      {
        lean: true,
      }
    );
    if (!specs)
      return res
        .status(500)
        .send({ message: "Category Specification not found!!", status: 500 });
    let allowedIds;
    if (specs["type"] == true) {
      if (!req.params.type)
        return res
          .status(412)
          .send({ message: `Please provide Item type`, status: 412 });

      cn = await Custom.findOne({
        title: req.body.title,
        eID: req.params.id,
        type: req.params.type,
      });
    } else {
      cn = await Custom.findOne({
        title: req.body.title,
        eID: req.params.id,
      });
    }

    if (!cn) {
      cn = new Custom({ ...req.body });
      if (specs["type"] == true) {
        await Custom.countDocuments(
          { eID: req.params.id, type: req.params.type },
          function (err, c) {
            cn.priority = c;
          }
        );
        cn.type = req.params.type;
      } else {
        await Custom.countDocuments({ eID: req.params.id }, function (err, c) {
          cn.priority = c;
        });
      }
      cn.eID = req.params.id;
      if (specs["type"]) cn.type = req.params.type;
      cn = await cn.save();
      return res.send({
        message: `Created Item`,
        status: 201,
        data: cn,
      });
    } else {
      return res.status(400).send({
        message: `Item with title ${req.body.title} already exists!`,
        status: 400,
      });
    }
  } catch (e) {
    console.log(e.message);
    return res.status(500).send({ message: e.message, status: e.code });
  }
};

/// REMOVE Item /:id
const Remove = async (req, res) => {
  if (!req.params.id)
    return res.status(412).send({
      message: `Please provide Item id`,
      status: 412,
    });
  try {
    const cn = await Custom.findOne({
      _id: req.params.id,
    });
    if (!cn)
      return res
        .status(400)
        .send({ message: `Item does not exist!`, status: 400 });
    await cn.remove();

    res.send({ message: `Item Removed Successfully!`, status: 200 });
  } catch (e) {
    console.log(e.message);
    res.status(500).send({ message: e.message, status: 500 });
  }
};

/// REMOVE CATEGORY /:cID/:type
const RemoveType = async (req, res) => {
  if (!req.params.cID || !req.params.type)
    return res.status(412).send({
      message: `Please provide ${!req.params.cID ? "category id" : "type"}`,
      status: 412,
    });
  try {
    const cn = await Custom.deleteMany({
      eID: req.params.cID,
      type: req.params.type,
    });
    console.log(cn);
    if (cn.deletedCount == 0)
      return res.status(200).send({ message: "No item found!", status: 200 });
    res.send({ message: `Items Removed Successfully!`, status: 200 });
  } catch (e) {
    console.log(e.message);
    res.status(500).send({ message: e.message, status: 500 });
  }
};

module.exports = {
  List,
  GetItem,
  Create,
  ListSpecification,
  UpdateSpecificaiton,
  UpdateItem,
  UpdatePriority,
  Remove,
  RemoveType,
};
