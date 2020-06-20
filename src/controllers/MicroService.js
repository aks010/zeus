const MicroService = require("../modals/banners/MicroService");

const List = async (req, res) => {
  try {
    const cn = await MicroService.find(
      {},
      ["title", "icon", "link", "color", "priority", "msId"],
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
    const allowedIds = await MicroService.find({}, ["msId"]);
    let allowedUpdates = [];

    allowedIds.forEach((o) => allowedUpdates.push(o["msId"]));
    let isValidOperation = cn.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send("Not cool");
    }
    isValidOperation = allowedUpdates.every((update) => cn.includes(update));
    // console.log(allowedUpdates);
    if (!isValidOperation) {
      return res.status(400).send("Not cool");
    }

    cn.forEach(async (o) => {
      await MicroService.findOneAndUpdate(
        { msId: o },
        { priority: req.body[o] - min }
      );
    });
    cn = await MicroService.find(
      {},
      ["title", "icon", "link", "color", "priority", "msId"],
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
    let cn = await MicroService.findOne({ title: req.body.title });
    if (!cn) {
      cn = new MicroService({ ...req.body });
      await MicroService.countDocuments({}, function (err, c) {
        cn.priority = c;
      });
      cn = await cn.save();
      res.send(cn);
    } else {
      res
        .status(412)
        .send(`Micro Service Item with name ${req.body.title} already exists!`);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

const Update = async (req, res) => {
  // req.params = id
  let updates = Object.keys(req.body);
  const allowedUpdates = ["title", "link", "color", "icon"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  //   console.log("HERE");
  if (!isValidOperation) {
    res.status(400).send();
  }
  try {
    let cn = await MicroService.findOne({ msId: req.params.id });
    if (!cn) res.status(404).send();
    updates.forEach((update) => (cn[update] = req.body[update]));
    cn.save();
    res.send(cn);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};

const Remove = async (req, res) => {
  // req.params = msId;
  try {
    const removed = await MicroService.findOneAndDelete({
      msId: req.params.id,
    });
    if (!removed) return res.status(400).send();

    const collections = await MicroService.find({
      priority: { $gte: removed_banner.priority },
    });

    collections.forEach(async (o) => {
      await MicroService.updateOne(
        { msId: o.msId },
        { priority: o.priority - 1 }
      );
    });

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
