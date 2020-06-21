const BrowseCategory = require("../modals/banners/BrowseCategory");
const BrowseCategoryItem = require("../modals/banners/BrowseCategoryItem");

const List = async (req, res) => {
  try {
    const cn = await BrowseCategory.find({}, ["title", "link", "priority"], {
      sort: { priority: 1 },
    });

    let listData = [];
    for (const o of cn) {
      const items = await BrowseCategoryItem.find(
        { categoryID: o["_id"] },
        ["title", "imgLink", "link", "category", "priority"],
        { sort: { priority: 1 } }
      );
      //   console.log(o);
      let obj = {};
      obj.items = items;
      obj.cID = o["_id"];
      obj.link = o["link"];
      obj.priority = o["priority"];
      obj.title = o["title"];
      listData.push(obj);
    }
    res.send(listData);
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e.message);
  }
};

const UpdatePriority = async (req, res) => {
  let cn = Object.keys(req.body);
  let min = 1000000;
  cn = cn.map((o) => {
    min = min < parseInt(req.body[o]) ? min : parseInt(req.body[o]);
    return parseInt(o);
  });
  //   console.log(cn);
  try {
    const allowedIds = await BrowseCategory.find({}, ["_id"]);
    // console.log(allowedIds);
    let allowedUpdates = [];

    allowedIds.forEach((o) => allowedUpdates.push(o["_id"]));
    let isValidOperation = cn.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(412).send({
        message: "Incomplete list of items for setting priority",
        code: 412,
      });
    }
    isValidOperation = allowedUpdates.every((update) => cn.includes(update));
    // console.log(allowedUpdates);
    if (!isValidOperation) {
      return res.status(412).send({
        message: "Incomplete list of items for setting priority",
        code: 412,
      });
    }

    cn.forEach(async (o) => {
      await BrowseCategory.findOneAndUpdate(
        { _id: o },
        { priority: req.body[o] - min }
      );
    });
    res.send({ message: "Successfully Updated Priority!" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

const Create = async (req, res) => {
  try {
    let cn = await BrowseCategory.findOne({ title: req.body.title });
    if (!cn) {
      cn = new BrowseCategory({ ...req.body });
      await BrowseCategory.countDocuments({}, function (err, c) {
        cn.priority = c;
      });
      cn = await cn.save();
      console.log(cn);
      res.send(cn);
    } else {
      res.status(400).send({ message: `Title '${req.body.title}' is in use!` });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

const Update = async (req, res) => {
  // req.params.id
  let updates = Object.keys(req.body);
  const allowedUpdates = ["title", "link"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    res.status(400).send();
  }
  try {
    let cn = await BrowseCategory.findOne({ _id: req.params.id });
    if (!cn)
      return res
        .status(404)
        .send({ message: "Cannot find requested category!" });
    console.log(cn);
    updates.forEach((update) => (cn[update] = req.body[update]));
    await cn.save();
    res.send(cn);
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "Can't Update! Title in Use." });
  }
};

const Remove = async (req, res) => {
  // req.params.id;
  try {
    const remove = await BrowseCategory.findOne({
      _id: req.params.id,
    });
    if (!remove) return res.status(400).send();
    await remove.remove();
    console.log(remove.priority);
    const collections = await BrowseCategory.find({
      priority: { $gte: remove.priority },
    });
    for (const o of collections) {
      await BrowseCategory.updateOne(
        { _id: o._id },
        { priority: o.priority - 1 }
      );
    }

    res.send({ message: "Successfully Deleted!" });
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e);
  }
};

module.exports = {
  List,
  Create,
  UpdatePriority,
  Update,
  Remove,
};
