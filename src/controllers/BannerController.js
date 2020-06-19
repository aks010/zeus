const Banners = require("../modals/Banner");

const ListBanners = async (req, res) => {
  try {
    const banners = await Banners.find(
      {},
      ["title", "priority", "link", "heading", "type"],
      {
        sort: { priority: 1 },
      }
    );
    res.send(banners);
  } catch (e) {
    res.status(500).send(e);
  }
};

const UpdatePriority = async (req, res) => {
  let banners = Object.keys(req.body);
  try {
    banners.forEach(async (o) => {
      await Banners.findOneAndUpdate({ title: o }, { priority: req.body[o] });
    });
    banners = await Banners.find(
      {},
      ["title", "priority", "link", "heading", "type"],
      {
        sort: { priority: 1 },
      }
    );
    res.send(banners);
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
};

const CreateBanner = async (req, res) => {
  console.log(req.body);
  if (!req.body.title) return res.status(401).send("Title Empty");
  try {
    let banner = await Banners.findOne({ title: req.body.title });

    if (!banner) {
      banner = new Banners({ ...req.body });
      await Banners.countDocuments({}, function (err, c) {
        banner.priority = c;
      });
      banner = await banner.save();
      res.send(banner);
    } else {
      res
        .status(412)
        .send(`Banner with name ${req.body.title} already exists!`);
    }
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

const RemoveBanner = async (req, res) => {
  console.log(req.params.id);
  try {
    const removed_banner = await Banners.findOneAndDelete({
      _id: req.params.id,
    });
    if (!removed_banner) return res.status(404).send();

    const banners = await Banners.find({
      priority: { $gte: removed_banner.priority },
    });

    banners.forEach(async (o) => {
      await Banners.updateOne({ _id: o._id }, { priority: o.priority - 1 });
    });

    res.send(removed_banner);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

module.exports = {
  ListBanners,
  CreateBanner,
  UpdatePriority,
  RemoveBanner,
};
