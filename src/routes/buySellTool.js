const express = require("express");
const router = express.Router();
const BuySellTool = require("../controllers/BuySellTool");

router.use(function timeLog(req, res, next) {
  next();
});

router.get("/", BuySellTool.List);
router.post("/create", BuySellTool.Create);
router.post("/update_priority", BuySellTool.UpdatePriority);
router.patch("/update/:id", BuySellTool.Update);
router.delete("/:id", BuySellTool.Remove);

module.exports = router;
