const express = require("express");
const router = express.Router();
const BannerController = require("../controllers/BannerController");

router.use(function timeLog(req, res, next) {
  next();
});

router.get("/", BannerController.ListBanners);
router.get("/all", BannerController.ListAllBanners);
router.post("/create", BannerController.CreateBanner);
router.post("/update_priority", BannerController.UpdatePriority);
router.delete("/:id", BannerController.RemoveBanner);

module.exports = router;
