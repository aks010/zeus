const express = require("express");
const router = express.Router();
const BrowseCategory = require("../controllers/BrowseCategory");

router.use(function timeLog(req, res, next) {
  next();
});

router.get("/", BrowseCategory.List);
router.post("/create", BrowseCategory.Create);
router.post("/update_priority", BrowseCategory.UpdatePriority);
router.patch("/update/:id", BrowseCategory.Update);
router.delete("/:id", BrowseCategory.Remove);

module.exports = router;
