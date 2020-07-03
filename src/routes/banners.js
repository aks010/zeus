const express = require("express");
const router = express.Router();
const BannerController = require("../controllers/Banner");

router.use(function timeLog(req, res, next) {
  next();
});

router.get("/", BannerController.ListBanners);
router.get("/all", BannerController.ListAllBanners);
router.post("/create", BannerController.CreateBanner);
router.patch("/update_priority", BannerController.UpdatePriority);
router.patch(
  "/update_priority_banner/:id",
  BannerController.UpdatePriorityBanner
);
router.delete("/remove/:id", BannerController.RemoveBanner);

module.exports = router;
