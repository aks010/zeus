const express = require("express");
const router = express.Router();
const BannerController = require("../controllers/BannersController");

router.use(function timeLog(req, res, next) {
  next();
});

router.get("/", BannerController.ListBanners);
router.post("/create", BannerController.CreateBanner);

module.exports = router;
