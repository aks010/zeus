const Article = require("../models/Type/Article");
const Spec = require("../models/Type/Spec");

/// List Items of Category /:id
const List = async (req, res) => {
  if (!req.params.id)
    return res
      .status(412)
      .send({ message: `Please provide banner id`, status: 412 });
  try {
    let cn = await Spec.findOne({ categoryID: req.params.id });
    if (!cn) return res.status(404).send();
    let resSpecs = [];
    for (const [key, value] of Object.entries(specs)) {
      if (value) resSpecs.push(key);
    }
    const cns = await Article.find({ categoryID: req.params.id }, resSpecs, {
      sort: { priority: 1 },
    });
    let data;
    for (const o of cns) {
      data[o["type"]].push(o);
    }
    res.send({
      message: "Items Fetched Successfully!",
      status: 200,
      data,
    });
  } catch (e) {
    res.status(500).send({ message: e.message, status: 500 });
  }
};

/// LIST ITEMS OF BANNER CATEGORY /:id
const GetItem = async (req, res) => {
  if (req.params.id)
    return res.status(412).send({
      message: `Please provide item id`,
      status: 412,
    });

  try {
    let cn = await Spec.findOne({ categoryID: req.params.id });
    if (!cn) return res.status(404).send();
    let resSpecs = [];
    for (const [key, value] of Object.entries(specs)) {
      if (value) resSpecs.push(key);
    }
    const o = await Article.find({ id: req.params.id }, resSpecs);
    return res.send({ message: "Item Fetched", data: o });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ message: e.message, status: 500 });
  }
};

// LIST SPECS WITH OPTIONS AND DISABLED
const ListSpecification = async (req, res) => {
  if (!req.params.id)
    return res
      .status(412)
      .send({ message: `Please provide Category id`, status: 412 });

  try {
    const specs = await Spec.findOne({ categoryID: req.params.id });
    let data = {};
    data["required"] = [
      "title",
      "imgLink",
      "link",
      "eventDate",
      "caption",
      "type",
    ];
    for (const [key, value] of Object.entries(specs)) {
      if (value) if (!data[required].find(key)) data["options"].push(key);
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
  const allowedUpdates = [
    "title",
    "imgLink",
    "link",
    "eventDate",
    "caption",
    "type",
    "price",
    "rating",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    res.status(400).send();
  }
  try {
    let cn = await Spec.findOne({ categoryID: req.params.id });
    if (!cn) return res.status(404).send();
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
    const specs = await Spec.find({ categoryID: req.params.id });
    let allowedIds;
    if (specs["type"]) {
      if (!req.params.type)
        return res
          .status(412)
          .send({ message: `Please provide Item type`, status: 412 });
      allowedIds = await Article.find(
        { categoryID: req.params.id, type: req.body.type },
        ["_id"]
      );
    } else {
      allowedIds = await Article.find({ categoryID: req.params.id }, ["_id"]);
    }
    let allowedUpdates = [];

    allowedIds.forEach((o) => allowedUpdates.push(o["_id"]));
    let isValidOperation = cn.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({
        message: "Incomplete list of items for setting priority",
        code: 400,
      });
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

    let specs = await Spec.findOne({ categoryID: cn["categoryID"] });
    if (!specs) return res.status(404).send();

    let resSpecs = [];
    for (const [key, value] of Object.entries(specs)) {
      if (value) resSpecs.push(key);
    }
    const allowedUpdates = resSpecs;

    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      res.status(400).send();
    }

    updates.forEach((update) => (cn[update] = req.body[update]));
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
  if (!req.params.id || req.body.title == "" || req.body.title == null)
    return res.status(412).send({
      message: `Please provide ${!req.prams.id ? "Category id" : "Item title"}`,
      status: 412,
    });
  try {
    let cn;
    const specs = await Spec.find({ categoryID: req.params.id });
    let allowedIds;
    if (specs["type"]) {
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
      await Article.countDocuments({ categoryID: req.params.id }, function (
        err,
        c
      ) {
        cn.priority = c;
      });
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

/// REMOVE CATEGORY /:id
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
    if (!cn) return res.status(404).send({ message: `Item does not exist!` });
    await cn.remove();

    const cns = await Article.find({
      priority: { $gte: cn.priority },
    });

    for (const o of cns) {
      await Article.updateOne({ _id: o._id }, { priority: o.priority - 1 });
    }

    res.send({ message: `Item Removed Successfully!`, status: 200 });
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
};
