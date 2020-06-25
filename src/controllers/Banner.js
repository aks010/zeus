const Banners = require("../models/Banner");
const Utils = require("../shared/utils/helper");

const ListBanners = async (req, res) => {
  try {
    const banners = await Banners.find(
      {},
      ["_id", "title", "link", "hasCategory", "model", "priority"],
      {
        sort: { priority: 1 },
      }
    );
    res.send({
      message: "Banners Fetched Successfully!",
      status: 200,
      data: banners,
    });
  } catch (e) {
    res.status(500).send({ message: e.message, status: 500 });
  }
};

const ListAllBanners = async (req, res) => {
  try {
    const banners = await Banners.sendData(); // TRY THROWING ERROR FROM FUNCTION CATCH
    if (!banners.message)
      res.send({
        message: "Banners Fetched Successfully!",
        data: banners,
        status: 200,
      });
    else throw Error(banners.message);
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e.message);
  }
};

/// todo: UPDATING BANNER MODEL

const UpdatePriority = async (req, res) => {
  let banners = Object.keys(req.body);

  let cn = Object.keys(req.body);
  let min = 1000000;
  cn.forEach((o) => {
    min = min < parseInt(req.body[o]) ? min : parseInt(req.body[o]);
  });
  try {
    const allowedIds = await Banners.find({}, ["_id"]);
    // console.log()
    let allowedUpdates = [];

    allowedIds.forEach((o) => allowedUpdates.push(o["_id"].toString()));
    let isValidOperation = cn.every((update) =>
      allowedUpdates.includes(update)
    );
    // console.log(allowedUpdates);
    // console.log(cn);
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
      await Banners.findOneAndUpdate(
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

const CreateBanner = async (req, res) => {
  // console.log(req.body);
  if (!req.body.title) return res.status(401).send("Title Empty");
  try {
    let banner = await Banners.findOne({ title: req.body.title });

    if (!banner) {
      banner = new Banners({ ...req.body });
      if (banner.model == "Category") banner.hasCategory = true;
      if (banner.hasCategory == true && banner.model != "Category") {
        return res.status(400).send({
          message:
            "Cannot Set 'hasCategory' true for non-Category Model Banner!",
        });
      }
      await Banners.countDocuments({}, function (err, c) {
        banner.priority = c;
      });
      banner = await banner.save();
      await Utils.setModelSpecification(req.body.model, banner._id, true);
      res.send({
        message: `Created Banner`,
        status: 201,
        data: banner,
      });
    } else {
      res.status(400).send({
        message: `Banner with name ${req.body.title} already exists!`,
        status: 400,
      });
    }
  } catch (e) {
    console.log(e);
    res.send({ message: e.message, status: e.code });
  }
};

const RemoveBanner = async (req, res) => {
  console.log(req.params.id);
  try {
    const banner = await Banners.findOne({
      _id: req.params.id,
    });
    if (!banner)
      return res
        .status(400)
        .send({ message: "Banner does not exist!", status: 400 });
    await banner.remove();

    const banners = await Banners.find({
      priority: { $gte: banner.priority },
    });

    for (const o of banners) {
      await Banners.updateOne({ _id: o._id }, { priority: o.priority - 1 });
    }

    res.send({ message: `Banner Removed Successfully!`, status: 200 });
  } catch (e) {
    console.log(e.message);
    res.status(500).send({ message: e.message, status: 500 });
  }
};

module.exports = {
  ListBanners,
  CreateBanner,
  UpdatePriority,
  RemoveBanner,
  ListAllBanners,
};