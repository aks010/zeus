const Category = require("../models/Category");
const Utils = require("../shared/utils/helper");
const Specs = require("../models/Type/Spec");

const ReadCategory = async (req, res) => {
  if (!req.params.id) {
    return res
      .status(412)
      .send({ message: "Please provide category id!", status: 412 });
  }
  try {
    const category = await Category.findOne(
      { _id: req.params.id },
      ["-createdAt", "-updatedAt", "-priority"],
      { lean: true }
    );
    if (!category) {
      return res
        .status(400)
        .send({ message: "Category does not exist", status: 400 });
    }
    return res.send({
      message: "Category Fetched",
      status: 200,
      data: category,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).send("Something Went Wrong!");
  }
};

/// List Categories of Banner /:id
const ListCategories = async (req, res) => {
  if (!req.params.id)
    return res
      .status(412)
      .send({ message: `Please provide banner id`, status: 412 });
  try {
    const cns = await Category.find(
      { eID: req.params.id },
      ["_id", "title", "link", "childModel", "priority"],
      {
        sort: { priority: 1 },
      }
    );
    res.send({
      message: "Categories Fetched Successfully!",
      status: 200,
      data: cns,
    });
  } catch (e) {
    res.status(500).send({ message: e.message, status: 500 });
  }
};
/// LIST ITEMS CATEGORY /:id
const ListCategoryItems = async (req, res) => {
  if (!req.params.id)
    return res.status(412).send({
      message: `Please provide category id`,
      status: 412,
    });

  try {
    const o = await Category.findOne({ _id: req.params.id }, [
      "childModel",
      "title",
    ]);
    if (!o) {
      return res
        .status(404)
        .send({ message: "Requested category does not exist", status: 404 });
    }
    console.log("HERER");
    console.log(o);
    console.log(o["_id"]);
    let { error, data } = await Utils.getDataFromModel(
      o["childModel"],
      o["_id"]
    ); /// TEST FOR ERROR THROW FROM FUNCTION
    if (error != null) throw new Error(error);
    let obj = {};
    obj.items = data; // array
    obj.cID = o["_id"];
    obj.link = o["link"];
    obj.title = o["title"];
    obj.priority = o["priority"];
    res.send({
      message: `Items fetched successfully!`,
      status: 200,
      data: obj,
    });
  } catch (e) {
    console.log(e);
    return { message: e.message, status: 500 };
  }
};

/// List all categories with items inside banner /:id
const ListAll = async (req, res) => {
  if (!req.params.id)
    return res
      .status(412)
      .send({ message: `Please provide banner id`, status: 412 });
  try {
    const categoryList = await Category.find(
      { eID: req.params.id },
      ["childModel", "title", "priority", "link"],
      { sort: { priority: 1 } }
    );
    let rs = [];

    for (const o of categoryList) {
      let { error, data } = await Utils.getDataFromModel(
        o["childModel"],
        o["_id"]
      ); /// TEST FOR ERROR THROW FROM FUNCTION
      console.log(o);
      if (error != undefined) throw new Error(error);
      let obj = {};
      obj.items = data; // array
      obj.categoryID = o["_id"];
      obj.link = o["link"];
      obj.title = o["title"];
      obj.priority = o["priority"];
      obj.childModel = o["childModel"];
      rs.push(obj);
    }
    return res.send({
      message: "Banner Data Fetched Successfully!",
      status: 200,
      data: rs,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ message: e.message, status: 500 });
  }
};

/// UPDATE CATEGORY /:id

const UpdateCategory = async (req, res) => {
  if (!req.params.id)
    return res
      .status(412)
      .send({ message: `Please provide category id`, status: 412 });

  try {
    let updates = Object.keys(req.body);
    let cn = await Category.findOne({ _id: req.params.id });
    if (!cn)
      return res
        .status(400)
        .send({ message: "Requested Category does not exist!", status: 400 });
    const allowedUpdates = ["title", "link"];

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
    return res.status(500).send({ message: e.message, status: e.code });
  }
};

/// UPDATE CATEGORY PRIORITY (indvl) /:BID/:CID
const UpdateCategoryPriority = async (req, res) => {
  console.log(req.params.CID);
  try {
    const category = await Category.findOne({
      _id: req.params.CID,
      eID: req.params.BID,
    });
    if (!category)
      return res
        .status(400)
        .send({ message: "Category does not exist!", status: 400 });

    if (req.body.priority > category.priority) {
      const cns = await Category.find({
        eID: req.params.BID,
        priority: { $lte: req.body.priority, $gte: category.priority + 1 },
      });
      for (const o of cns) {
        await Category.updateOne({ _id: o._id }, { priority: o.priority - 1 });
      }
    } else {
      const cns = await Category.find({
        priority: { $gte: req.body.priority, $lte: category.priority - 1 },
      });
      for (const o of cns) {
        await Category.updateOne({ _id: o._id }, { priority: o.priority + 1 });
      }
    }
    await Category.updateOne(
      { _id: req.params.CID },
      { priority: req.body.priority }
    );
    // await category.save();

    res.send({ message: `Priority Updated!`, status: 200 });
  } catch (e) {
    console.log(e.message);
    res.status(500).send({ message: e.message, status: 500 });
  }
};

// UPDATE PRIORITY OF CATEGORY IN BANNER /:id
const UpdatePriority = async (req, res) => {
  if (!req.params.id)
    return res
      .status(412)
      .send({ message: `Please provide banner id`, status: 412 });
  let cn = Object.keys(req.body);
  let min = 1000000;
  cn.forEach((o) => {
    min = min < parseInt(req.body[o]) ? min : parseInt(req.body[o]);
  });

  try {
    const allowedIds = await Category.find({ eID: req.params.id }, ["_id"]);
    // console.log()
    let allowedUpdates = [];

    allowedIds.forEach((o) => allowedUpdates.push(o["_id"].toString()));
    let isValidOperation = cn.every((update) =>
      allowedUpdates.includes(update)
    );
    console.log(cn);
    console.log(allowedUpdates);
    if (!isValidOperation) {
      return res.status(400).send({
        message: "Incomplete list of items for setting priority",
        code: 400,
      });
    }
    isValidOperation = allowedUpdates.every((update) => cn.includes(update));
    // console.log(allowedUpdates);
    if (!isValidOperation) {
      return res.status(400).send({
        message: "Incomplete list of items for setting priority",
        code: 400,
      });
    }

    for (const o of cn) {
      await Category.findOneAndUpdate(
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

/// CREATE CATEGORY OF BANNER /:id
const CreateCategory = async (req, res) => {
  if (!req.params.id || req.body.title == "" || req.body.title == null)
    return res.status(412).send({
      message: `Please provide banner id`,
      status: 412,
    });
  try {
    let category = await Category.findOne({
      title: req.body.title,
      eID: req.params.id,
    });
    if (!category) {
      // CHECK EXISTENCE OF CHILD MODEL
      if (!Utils.checkModelExistence(req.body.childModel))
        return res.status(400).send({
          message: `Invalid Model!`,
          status: 400,
        });
      category = new Category({ ...req.body });
      category.eID = req.params.id;
      await Category.countDocuments({ eID: req.params.id }, function (err, c) {
        category.priority = c;
      });
      category = await category.save();
      const error = await Specs.SetModelSpecification(
        req.body.childModel,
        category._id,
        req.body.specs
      );
      if (error.error != null) throw new Error(error.error);
      return res.send({
        message: `Created Category`,
        status: 201,
        data: category,
      });
    } else {
      return res.status(400).send({
        message: `Category with name ${req.body.title} already exists!`,
        status: 400,
      });
    }
  } catch (e) {
    /// CASE: IF CATEGORY IS NOT CREATED AFTER SET SPECS
    console.log(e.message);
    return res.status(500).send({ message: e.message, status: e.code });
  }
};
/// REMOVE CATEGORY /:id
const RemoveCategory = async (req, res) => {
  if (!req.params.id)
    return res.status(412).send({
      message: `Please provide category id`,
      status: 412,
    });
  try {
    const category = await Category.findOne({
      _id: req.params.id,
    });
    if (!category)
      return res
        .status(400)
        .send({ message: `Category does not exist!`, status: 400 });
    await category.remove();

    const cns = await Category.find({
      priority: { $gte: category.priority },
    });

    for (const o of cns) {
      await Category.updateOne({ _id: o._id }, { priority: o.priority - 1 });
    }

    res.send({ message: `Category Removed Successfully!`, status: 200 });
  } catch (e) {
    console.log(e.message);
    res.status(500).send({ message: e.message, status: 500 });
  }
};

module.exports = {
  ReadCategory,
  ListAll,
  ListCategories,
  ListCategoryItems,
  CreateCategory,
  UpdateCategory,
  UpdateCategoryPriority,
  UpdatePriority,
  RemoveCategory,
};
