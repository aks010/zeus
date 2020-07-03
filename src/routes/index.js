const express = require("express");
const router = express.Router();

router.use("/banners", require("./banners"));
router.use("/article", require("./articles"));
router.use("/custom", require("./custom"));
router.use("/category", require("./category"));

module.exports = router;
