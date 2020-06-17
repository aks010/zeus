const express = require("express");
const router = express.Router();

router.use("/banners", require("./banners"));

module.exports = router;
