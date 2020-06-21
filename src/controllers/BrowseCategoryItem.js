const BrowseCategory = require("../modals/banners/BrowseCategory");
const BrowseCategoryItem = require("../modals/banners/BrowseCategoryItem");

const List = async (req, res) => {
  // req.params.id : id of banner category
  try {
    const cn = await BrowseCategoryItem.find(
      { categoryID: req.params.cID },
      ["title", "imgLink", "link", "categoryID", "priority"],
      {
        sort: { priority: 1 },
      }
    );

    res.send(cn);
  } catch (e) {
    res.status(500).send(e);
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
    const allowedIds = await BrowseCategoryItem.find(
      { categoryID: req.params.cID },
      ["_id"]
    );
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

    for (const o of cn) {
      await BrowseCategoryItem.findOneAndUpdate(
        { _id: o },
        { priority: req.body[o] - min }
      );
    }
    // cn = await BrowseCategoryItem.find(
    //   {},
    //   ["title", "icon", "link", "color", "priority", "_id"],
    //   {
    //     sort: { priority: 1 },
    //   }
    // );
    res.send({ message: "Successfully Updated Priority!" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

const Create = async (req, res) => {
  try {
    const isCategory = await BrowseCategory.findOne({ _id: req.params.cID });
    if (!isCategory)
      return res.status(400).send({ message: "Category does not exist!" });

    let cn = await BrowseCategoryItem.findOne({
      title: req.body.title,
      categoryID: req.params.cID,
    });
    if (!cn) {
      cn = new BrowseCategoryItem({ ...req.body, categoryID: req.params.cID });
      await BrowseCategoryItem.countDocuments(
        { categoryID: req.params.cID },
        function (err, c) {
          cn.priority = c;
        }
      );
      cn = await cn.save();
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
  const allowedUpdates = ["title", "imgLink", "link", "cID"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    res.status(400).send();
  }
  try {
    let cn = await BrowseCategoryItem.findOne({ _id: req.params.id });
    if (!cn) return res.status(404).send();
    let validCID = {};
    if (req.body.categoryID)
      validCID = await BrowseCategory.findOne({ _id: req.body.categoryID });
    if (validCID === null)
      return res
        .status(400)
        .send({ message: "Requested Category Not Found!!", code: 400 });
    updates.forEach((update) => (cn[update] = req.body[update]));
    await cn.save();
    const data = await BrowseCategory.sendData();
    res.send(data);
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "Can't Update! Title in Use." });
  }
};

const Remove = async (req, res) => {
  // req.params.id;
  try {
    const removed = await BrowseCategoryItem.findOneAndDelete({
      _id: req.params.id,
    });
    if (!removed) return res.status(400).send();

    ///  THESE CAN BE MERGED BY findManyAndUpdate()
    const collections = await BrowseCategoryItem.find({
      categoryID: req.params.cID,
      priority: { $gte: removed.priority },
    });

    for (const o of collections) {
      await BrowseCategoryItem.updateOne(
        { _id: o._id },
        { priority: o.priority - 1 }
      );
    }

    res.send(removed);
  } catch (e) {
    console.log(e);
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
