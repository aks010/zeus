const Banners = require("../modals/banners");

const ListBanners = (req, res) => {
  res.send("Listing All Banners");
};

const CreateBanner = async (req, res) => {
  console.log(req.body);
  if (!req.body.title) return res.status(401).send("Title Empty");
  try {
    let banner = await Banners.findOne({ title: req.body.title });
    if (!banner) {
      banner = new Banners({ ...req.body });
      banner = await banner.save();
      res.send(banner);
    }
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

module.exports = {
  ListBanners,
  CreateBanner,
};
