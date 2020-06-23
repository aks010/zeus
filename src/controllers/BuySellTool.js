const BuySellTool = require("../models/banners/BuySellTool");

const List = async (req, res) => {
  try {
    const cn = await BuySellTool.find({}, ["title", "icon", "priority"], {
      sort: { priority: 1 },
    });

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
    const allowedIds = await BuySellTool.find({}, ["_id"]);
    let allowedUpdates = [];

    allowedIds.forEach((o) => allowedUpdates.push(o["_id"]));
    let isValidOperation = cn.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send();
    }
    isValidOperation = allowedUpdates.every((update) => cn.includes(update));
    // console.log(allowedUpdates);
    if (!isValidOperation) {
      return res.status(400).send();
    }

    cn.forEach(async (o) => {
      await BuySellTool.findOneAndUpdate(
        { _id: o },
        { priority: req.body[o] - min }
      );
    });
    cn = await BuySellTool.find({}, ["title", "icon", "priority"], {
      sort: { priority: 1 },
    });
    res.send(cn);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

const Create = async (req, res) => {
  try {
    let cn = await BuySellTool.findOne({ title: req.body.title });
    if (!cn) {
      cn = new BuySellTool({ ...req.body });
      await BuySellTool.countDocuments({}, function (err, c) {
        cn.priority = c;
      });
      cn = await cn.save();
      res.send(cn);
    } else {
      res.status(400).send({ message: `Title '${cn.title}' is in use!` });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

const Update = async (req, res) => {
  // req.params.id
  let updates = Object.keys(req.body);
  const allowedUpdates = ["title", "icon"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    res.status(400).send();
  }
  try {
    let cn = await BuySellTool.findOne({ _id: req.params.id });
    if (!cn) res.status(404).send();
    updates.forEach((update) => (cn[update] = req.body[update]));
    await cn.save();
    res.send(cn);
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .send({ message: "Can't Update! Title in Use.", status: 400 });
  }
};

const Remove = async (req, res) => {
  // req.params.id;
  try {
    const removed = await BuySellTool.findOneAndDelete({
      _id: req.params.id,
    });
    if (!removed) return res.status(400).send();

    const collections = await BuySellTool.find({
      priority: { $gte: removed.priority },
    });

    for (const o in collections) {
      await BuySellTool.updateOne({ _id: o._id }, { priority: o.priority - 1 });
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
