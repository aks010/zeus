const express = require("express");
const router = express.Router();
const BannerController = require("../controllers/Banner");
const auth = require("../middleware/auth");
router.use(auth);

router.get("/", BannerController.ListBanners);
router.get("/all", BannerController.ListAllBanners);
router.get("/models", BannerController.ModelList);
router.post("/create", BannerController.CreateBanner);
router.patch("/update/:id", BannerController.UpdateBanner);
router.patch("/update_priority", BannerController.UpdatePriority);
router.get("/read/:id", BannerController.ReadBanner);
router.patch(
  "/update_priority_banner/:id",
  BannerController.UpdatePriorityBanner
);
router.delete("/remove/:id", BannerController.RemoveBanner);

module.exports = router;
