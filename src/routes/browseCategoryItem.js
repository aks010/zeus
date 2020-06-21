const express = require("express");
const router = express.Router();
const BrowseCategoryItem = require("../controllers/BrowseCategoryItem");

router.use(function timeLog(req, res, next) {
  next();
});

router.get("/:cID", BrowseCategoryItem.List);
router.post("/create/:cID", BrowseCategoryItem.Create);
router.post("/update_priority/:cID", BrowseCategoryItem.UpdatePriority);
router.patch("/update/:cID/:id", BrowseCategoryItem.Update);
router.delete("/:cID/:id", BrowseCategoryItem.Remove);

module.exports = router;
