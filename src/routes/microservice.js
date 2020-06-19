const express = require("express");
const router = express.Router();
const MicroSerice = require("../controllers/MicroService");

router.use(function timeLog(req, res, next) {
  next();
});

router.get("/", MicroSerice.List);
router.post("/create", MicroSerice.Create);
router.post("/update_priority", MicroSerice.UpdatePriority);
router.patch("/update/:id", MicroSerice.Update);
router.delete("/:id", MicroSerice.Remove);

module.exports = router;
