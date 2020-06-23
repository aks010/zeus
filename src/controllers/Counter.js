const Counter = require("../models/banners/Counter");

const List = async (req, res) => {
  try {
    const cn = await Counter.find(
      {},
      ["title", "count", "unit", "type", "priority"],
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
    const allowedIds = await Counter.find({}, ["_id"]);
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
      await Counter.findOneAndUpdate(
        { _id: o },
        { priority: req.body[o] - min }
      );
    });
    cn = await Counter.find(
      {},
      ["title", "icon", "link", "color", "priority", "_id"],
      {
        sort: { priority: 1 },
      }
    );
    res.send(cn);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

const Create = async (req, res) => {
  try {
    let cn = await Counter.findOne({ title: req.body.title });
    if (!cn) {
      cn = new Counter({ ...req.body });
      await Counter.countDocuments({}, function (err, c) {
        cn.priority = c;
      });
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
  const allowedUpdates = ["title", "count", "unit", "type"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    res.status(400).send();
  }
  try {
    let cn = await Counter.findOne({ _id: req.params.id });
    if (!cn) res.status(404).send();
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
    const removed = await Counter.findOneAndDelete({
      _id: req.params.id,
    });
    if (!removed) return res.status(400).send();

    const collections = await Counter.find({
      priority: { $gte: removed.priority },
    });

    for (const o in collections) {
      await Counter.updateOne({ _id: o._id }, { priority: o.priority - 1 });
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
