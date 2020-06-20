const express = require("express");
const router = express.Router();
const Counter = require("../controllers/Counter");

router.use(function timeLog(req, res, next) {
  next();
});

router.get("/", Counter.List);
router.post("/create", Counter.Create);
router.post("/update_priority", Counter.UpdatePriority);
router.patch("/update/:id", Counter.Update);
router.delete("/:id", Counter.Remove);

module.exports = router;
