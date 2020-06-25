const Article = require("../models/Type/Article");
const Spec = require("../models/Type/Spec");
const Category = require("../models/Category");

const MODELS = require("../shared/constants");

/// List Items of Category /:id
const List = async (req, res) => {
  if (!req.params.id)
    return res
      .status(400)
      .send({ message: `Please provide banner id`, status: 400 });
  try {
    let cn = await Spec.findOne(
      { categoryID: req.params.id },
      ["-bannerID", "-isBanner"],
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

    const cns = await Article.find({ categoryID: req.params.id }, resSpecs, {
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

/// GET ARTICLE /:cID/:id
const GetItem = async (req, res) => {
  if (!req.params.id || !req.params.cID)
    return res.status(412).send({
      message: `Please provide ${!req.params.cID ? "category id" : "item id"}`,
      status: 412,
    });

  try {
    let cn = await Spec.findOne(
      { categoryID: req.params.cID },
      ["-isBanner", "-bannerID", "-createdAt", "-updatedAt"],
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
    const o = await Article.find({ _id: req.params.id }, resSpecs);
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
    const specs = await Spec.findOne(
      { categoryID: req.params.id },
      ["-priority"],
      { lean: true }
    );
    if (!specs)
      return res
        .status(500)
        .send({ message: "Category Specification not found!!", status: 500 });

    let isCategoryArticle = await Category.findOne(
      { _id: req.params.id },
      ["childModel"],
      { lean: true }
    );
    if (isCategoryArticle.childModel !== MODELS.ARTICLE)
      return res.status(400).send({
        message: `Model and Category Model does not match!`,
        status: 400,
      });
    let data = {};
    data["required"] = [
      "title",
      "imgLink",
      "link",
      "eventDate",
      "caption",
      "type",
    ];
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
    let cn = await Spec.findOne({ categoryID: req.params.id }, [
      "-isBanner",
      "-bannerID",
    ]);
    if (!cn)
      return res
        .status(500)
        .send({ message: "Category Specification not found!!", status: 500 });

    let isCategoryArticle = await Category.findOne(
      { _id: req.params.id },
      ["childModel"],
      { lean: true }
    );
    if (isCategoryArticle.childModel !== MODELS.ARTICLE)
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
    const specs = await Spec.findOne({ categoryID: req.params.id }, ["type"], {
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
      allowedIds = await Article.find(
        { categoryID: req.params.id, type: req.params.type },
        ["_id"],
        { lean: true }
      );
    } else {
      allowedIds = await Article.find({ categoryID: req.params.id }, ["_id"]);
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
      await Article.findOneAndUpdate(
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
    let cn = await Article.findOne({ _id: req.params.id });
    if (!cn)
      return res
        .status(400)
        .send({ message: "Item does not exist!", status: 400 });
    console.log(cn["categoryID"]);
    let specs = await Spec.findOne(
      { categoryID: cn["categoryID"] },
      ["-priority", "-bannerID", "-isBanner"],
      { lean: true }
    );
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
      isDuplicate = await Article.findOne({
        title: cn.title,
        type: cn.type,
        categoryID: cn.categoryID,
      });
    } else {
      isDuplicate = await Article.findOne({
        title: cn.title,
        categoryID: cn.categoryID,
      });
    }

    if (isDuplicate && isDuplicate["categoryID"] != cn.categoryID)
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
    const specs = await Spec.findOne(
      { categoryID: req.params.id },
      ["-isBanner", "-bannerID", "-createdAt", "-updatedAt", "-priority"],
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

      cn = await Article.findOne({
        title: req.body.title,
        categoryID: req.params.id,
        type: req.params.type,
      });
    } else {
      cn = await Article.findOne({
        title: req.body.title,
        categoryID: req.params.id,
      });
    }

    if (!cn) {
      cn = new Article({ ...req.body });
      if (specs["type"] == true) {
        await Article.countDocuments(
          { categoryID: req.params.id, type: req.params.type },
          function (err, c) {
            cn.priority = c;
          }
        );
      } else {
        await Article.countDocuments({ categoryID: req.params.id }, function (
          err,
          c
        ) {
          cn.priority = c;
        });
      }
      cn.categoryID = req.params.id;
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
    const cn = await Article.findOne({
      _id: req.params.id,
    });
    if (!cn)
      return res
        .status(400)
        .send({ message: `Item does not exist!`, status: 400 });
    await cn.remove();
    let cns;
    if (cn.type != null) {
      cns = await Article.find({
        categoryID: cn.categoryID,
        type: cn.type,
        priority: { $gte: cn.priority },
      });
    } else {
      cns = await Article.find({
        categoryID: cn.categoryID,
        priority: { $gte: cn.priority },
      });
    }
    for (const o of cns) {
      await Article.updateOne({ _id: o._id }, { priority: o.priority - 1 });
    }

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
    const cn = await Article.deleteMany({
      categoryID: req.params.cID,
      type: req.params.type,
    });
    console.log(cn);
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
